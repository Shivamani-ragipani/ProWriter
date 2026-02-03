import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini/client';
import { GRAMMAR_PROMPT, PROFESSIONAL_PROMPT } from '@/lib/gemini/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, mode, tone, userPreferences } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    let prompt;
    if (mode === 'professional') {
      prompt = PROFESSIONAL_PROMPT(text, tone || 'formal', userPreferences);
    } else {
      prompt = GRAMMAR_PROMPT(text, userPreferences);
    }

    const result = await generateContent(prompt);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Correction API error:', error);
    return NextResponse.json(
      { error: 'Failed to process text', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
