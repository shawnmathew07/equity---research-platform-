import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req: NextRequest) {
  const { ticker, name, price, change, industry, marketCap, pe, eps, beta, high52, low52 } = await req.json()

  const prompt = `You are a professional equity research analyst. Write a concise 3-sentence stock summary for ${name} (${ticker}) based on the following data:

- Current Price: $${price}
- Today's Change: ${change}%
- Industry: ${industry}
- Market Cap: $${marketCap}
- P/E Ratio: ${pe}
- EPS: $${eps}
- Beta: ${beta}
- 52-Week High: $${high52}
- 52-Week Low: $${low52}

Write like a Bloomberg terminal analyst note. Be specific, data-driven, and professional. 3 sentences max.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }]
  })

  const summary = (message.content[0] as any).text

  return NextResponse.json({ summary })
}