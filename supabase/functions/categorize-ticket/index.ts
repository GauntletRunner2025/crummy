import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log('Function starting...')

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

console.log('Environment variables:', {
  supabaseUrl: supabaseUrl ? 'Found' : 'Missing',
  supabaseServiceKey: supabaseServiceKey ? 'Found' : 'Missing',
  openaiKey: Deno.env.get('OPENAI_API_KEY') ? 'Found' : 'Missing'
})

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Ticket {
  id: string
  description: string
  body: string
  task_type?: string
}

interface DatabaseChangeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Ticket
  old_record?: Ticket
}

serve(async (req: Request) => {
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Log the raw request text first
    const rawText = await req.text();
    console.log('Raw request text:', rawText);

    // Parse the JSON manually so we can see any parsing errors
    let body;
    try {
      body = JSON.parse(rawText);
    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('Invalid JSON in request body: ' + e.message);
    }
    console.log('Parsed request body:', body);

    // Check if we're getting a database trigger payload
    let ticket: Ticket;
    if (body.type === 'INSERT' && body.table === 'tickets' && body.record) {
      console.log('Detected database trigger payload');
      ticket = body.record;
      console.log('Extracted ticket from trigger:', ticket);
    } else {
      console.log('Expecting direct API call payload');
      ticket = body.ticket;
      console.log('Extracted ticket from request:', ticket);
    }

    if (!ticket) {
      console.error('No ticket data provided in request');
      throw new Error('Ticket data is required')
    }

    if (!ticket.description || !ticket.body) {
      console.error('Missing required ticket fields:', { 
        hasDescription: !!ticket.description, 
        hasBody: !!ticket.body 
      });
      throw new Error('Ticket must have both description and body fields')
    }

    console.log('Getting OpenAI API key...');
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      console.error('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not found')
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Fetch task types from the database
    const { data: taskTypes, error: taskTypesError } = await supabase
      .from('task_types')
      .select('id, name, description');

    if (taskTypesError) {
      console.error('Error fetching task types:', taskTypesError);
      throw new Error('Error fetching task types: ' + taskTypesError.message);
    }

    if (!taskTypes || taskTypes.length === 0) {
      console.error('No task types found in the database');
      throw new Error('No task types found in the database');
    }

    console.log('Raw task types from DB:', JSON.stringify(taskTypes, null, 2));

    // Store task types in a collection
    const taskTypesCollection = taskTypes.map(taskType => ({
      id: taskType.id,
      name: taskType.name,
      description: taskType.description
    }));

    // Format task types into a readable string
    const taskTypesMessage = taskTypesCollection
      .map(type => `${type.name} - ${type.description}`)
      .join('\n');

    console.log('Task Types Message:', taskTypesMessage);

    // Get list of task type IDs for the enum
    const taskTypeIds = taskTypes.map(type => type.id);
    console.log('Available task type IDs:', taskTypeIds);

    const messages = [
      {
        "role": "system",
        "content": [
          {
            "text": "You are taking in a customer request and classifying it into one of several possibilities, including an Uncategorized category for requests that don't fit in anywhere else.\n",
            "type": "text"
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "text": ticket.description + "\n" + ticket.body,
            "type": "text"
          }
        ]
      }
    ];

    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-4o-mini',
      stream: false,
      response_format: {
        "type": "json_schema",
        "json_schema": {
          "name": "task_type_selection",
          "strict": true,
          "schema": {
            "type": "object",
            "properties": {
              "selected_category": {
                "type": "string",
                "description": "The most similar ticket type",
                "enum": taskTypeIds
              }
            },
            "required": [
              "selected_category"
            ],
            "additionalProperties": false
          }
        }
      },
    });

    const result = chatCompletion.choices[0].message.content;
    console.log('OpenAI response:', result);

    // Parse the result to get the selected option
    let selectedOption;
    try {
      const parsed = JSON.parse(result);
      selectedOption = parsed.selected_category;
      console.log('Selected option:', selectedOption);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      throw new Error('Invalid response format from OpenAI: ' + e.message);
    }

    if (!selectedOption) {
      throw new Error('No option selected in OpenAI response');
    }

    // Update the ticket with the selected task type
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ task_type: selectedOption })
      .eq('id', ticket.id);

    if (updateError) {
      throw new Error('Error updating ticket: ' + updateError.message);
    }

    return new Response(JSON.stringify({ success: true, task_type: selectedOption }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
});
