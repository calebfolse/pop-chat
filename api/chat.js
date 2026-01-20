// api/chat.js - Vercel Serverless Function
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Customize this system prompt for your boss's use case
const SYSTEM_PROMPT = `You are a helpful business strategy assistant for Pillar Optimization Partners, a firm that helps Gulf South industrial businesses become exit-ready.

You specialize in:
- Financial clarity and clean financials
- Proactive tax strategy
- Documented operations
- Exit planning and business valuation
- Growth strategy and scaling

Be professional, helpful, and concise. If asked about specific financial or legal advice, recommend they schedule a consultation at pop4success.com.`;

export default async function handler(req, res) {
    // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
        const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
              return res.status(400).json({ error: 'Messages array required' });
      }

      const completion = await openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                        ...messages
                      ],
              max_tokens: 800,
              temperature: 0.7
      });

      const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      res.status(200).json({ message: reply });

  } catch (error) {
        console.error('OpenAI error:', error);
        res.status(500).json({ error: 'Failed to get response' });
  }
}
