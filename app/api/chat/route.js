import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Format messages to only include required properties
    const formattedMessages = messages.map(({ role, content }) => ({
      role,
      content
    }));

    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "qwen-2.5-32b",
      temperature: 0.6,
      max_tokens: 4096,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error);
    
    // Return more specific error information
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error.message 
      },
      { status: error.status || 500 }
    );
  }
}