# Send Magic Link Function

This Edge Function uses Supabase's Admin API to send invite emails to users.

## Setup

1. Deploy the function:
   ```bash
   npx supabase functions deploy send-magic-link
   ```

2. Set the required environment variables:
   ```bash
   npx supabase secrets set SUPABASE_URL=your_project_url
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Usage

Make a POST request to the function with an email address:

```bash
curl -i --location --request POST 'https://[PROJECT_REF].supabase.co/functions/v1/send-magic-link' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"user@example.com"}'
```

## Development

For local development:
```bash
npx supabase functions serve send-magic-link
```

Then you can test locally:
```bash
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-magic-link' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"user@example.com"}'
```

## Security

This function uses the Supabase service role key to send invites. The key is stored securely as an environment variable and is never exposed to the client.
