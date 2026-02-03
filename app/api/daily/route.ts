import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini/client';
import { DAILY_TASK_PROMPT } from '@/lib/gemini/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userPreferences } = body;

    const prompt = DAILY_TASK_PROMPT(userPreferences);
    const result = await generateContent(prompt);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Daily tasks API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily tasks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
