import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini/client';
import { ROLEPLAY_PROMPT } from '@/lib/gemini/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario, userMessage, conversationHistory, isEnd } = body;

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario is required' },
        { status: 400 }
      );
    }

    const prompt = ROLEPLAY_PROMPT(
      scenario,
      userMessage || '',
      conversationHistory || [],
      isEnd || false
    );

    const result = await generateContent(prompt);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Practice API error:', error);
    return NextResponse.json(
      { error: 'Failed to process practice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
