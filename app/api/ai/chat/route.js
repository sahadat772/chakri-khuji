console.log('API KEY:', process.env.ANTHROPIC_API_KEY?.slice(0, 20));
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});


const SYSTEM_PROMPT = `You are an AI Career Assistant for "Chakri Khujhi" - Bangladesh's modern job platform. Your name is "Chakri AI".

Your role is to help job seekers and companies with:
- Resume/CV writing tips and optimization
- Interview preparation and common questions
- Career planning and guidance
- Job search strategies for Bangladesh market
- Salary negotiation tips
- Skills development recommendations
- Cover letter writing

Guidelines:
- Be concise, practical, and friendly
- Use a mix of English and Bengali naturally
- Keep responses under 150 words unless asked for detail
- Use bullet points for lists
- Be encouraging and positive
- Focus on Bangladesh job market context when relevant`;

export async function POST(req) {
    try {
        const { messages } = await req.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json({ message: 'Messages required' }, { status: 400 });
        }

        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            system: SYSTEM_PROMPT,
            messages: messages,
        });

        const text = response.content
            .filter(function (block) { return block.type === 'text'; })
            .map(function (block) { return block.text; })
            .join('');

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error('AI chat error:', error);
        return NextResponse.json({ message: 'AI service error' }, { status: 500 });
    }
}