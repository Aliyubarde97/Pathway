import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });

// How many free scans each student gets per day. Keep the same number in the app.
const FREE_DAILY_LIMIT = 5;

// Lagos is UTC+1 all year, so the day resets at midnight Lagos time.
const LAGOS_OFFSET_MS = 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
function startOfTodayLagos() {
  const now = Date.now();
  return new Date(Math.floor((now + LAGOS_OFFSET_MS) / DAY_MS) * DAY_MS - LAGOS_OFFSET_MS);
}

const SYSTEM = `You are a patient tutor for Nigerian students preparing for JAMB, WAEC, NECO and similar exams.
The student sends a picture of one exam question.
- If it is an objective question, start with "Answer: " and the correct option, then "Working:" with at most 5 short lines.
- If it is a written (theory or essay) question, give a clear model answer with the key points, in short lines.
- If you cannot read the picture or it is not a question, say so politely and ask for a clearer picture.
Use simple English. Use plain text only: no markdown, no asterisks, no hash signs.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const url = Deno.env.get('SUPABASE_URL')!;

    // 1. Who is asking? Strangers are refused.
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
    const authClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!);
    const { data: { user } } = await authClient.auth.getUser(token);
    if (!user) return reply({ error: 'login', message: 'Please log in to use this feature.' }, 401);

    // 2. Has this student used up today's free scans?
    const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { count } = await admin
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfTodayLagos().toISOString());

    const used = count ?? 0;
    const limit = FREE_DAILY_LIMIT; // later: a bigger number for Premium students
    if (used >= limit) {
      return reply({ error: 'limit', message: 'Daily limit reached.', used, limit }, 429);
    }

    // 3. Check the picture.
    const { imageBase64, mediaType } = await req.json();
    if (!imageBase64) return reply({ error: 'No picture received' }, 400);
    if (imageBase64.length > 6_000_000) return reply({ error: 'Picture is too large' }, 413);

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) return reply({ error: 'Server is not set up' }, 500);

    // 4. Ask Claude.
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5-5',
        max_tokens: 800,
        system: SYSTEM,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType ?? 'image/jpeg', data: imageBase64 },
              },
              { type: 'text', text: 'Solve the question in this picture.' },
            ],
          },
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Claude error', JSON.stringify(data));
      return reply({ error: 'AI error: ' + (data?.error?.message ?? 'unknown') }, 502);
    }

    // 5. Only a successful answer counts as one scan.
    await admin.from('ai_usage').insert({ user_id: user.id, kind: 'scan' });

    return reply({
      solution: data.content?.[0]?.text ?? '',
      remaining: Math.max(limit - used - 1, 0),
      limit,
    });
  } catch (e) {
    console.error(e);
    return reply({ error: 'Something went wrong' }, 500);
  }
});