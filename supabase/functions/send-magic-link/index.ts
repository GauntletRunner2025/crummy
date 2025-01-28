// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log('Function starting...')

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

console.log('Environment variables:', {
  supabaseUrl: supabaseUrl ? 'Found' : 'Missing',
  supabaseServiceKey: supabaseServiceKey ? 'Found' : 'Missing'
})

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

interface OnboardingRecord {
  id: string
  email: string
  notes: string
  status: string
  approved: boolean
  created_at: string
  requested_by_email: string | null
}

interface DatabaseChangeEvent {
  type: string
  table: string
  record: OnboardingRecord
  schema: string
  old_record: OnboardingRecord
}

serve(async (req: Request) => {
  console.log('Request received:', req.method)
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Parse request body
    const body: DatabaseChangeEvent = await req.json()
    console.log('Request body:', body)

    // Only process if this is an update to the onboarding table
    // and approved changed from false to true
    if (
      body.type === 'UPDATE' &&
      body.table === 'onboarding' &&
      body.schema === 'public' &&
      body.old_record.approved === false &&
      body.record.approved === true
    ) {
      const email = body.record.email
      console.log('Sending invite to:', email)

      // Create Supabase client using context auth
      const supabaseClient = createClient(
        // @ts-ignore
        Deno.env.get('SUPABASE_URL') ?? '',
        // @ts-ignore
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      // Send invite using admin API
      const { data, error } = await supabaseClient.auth.admin.inviteUserByEmail(email)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Invite sent successfully:', data)
      return new Response(JSON.stringify({ data }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      })
    } else {
      console.log('Skipping invite - conditions not met')
      return new Response(JSON.stringify({ message: 'No action needed' }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      })
    }

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 400,
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-magic-link' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"email":"user@example.com"}'

*/
