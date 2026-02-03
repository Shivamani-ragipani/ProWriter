export const GRAMMAR_PROMPT = (text: string, userPreferences?: any) => `
You are a precise English editor. Only correct grammar, spelling, punctuation, and capitalization. Preserve meaning and style as much as possible.

User's text: "${text}"

User preferences:
- Tone: ${userPreferences?.tone || 'neutral'}
- Domain: ${userPreferences?.domain || 'general'}
- Level: ${userPreferences?.level || 'intermediate'}

Provide your response in this exact JSON format (return ONLY valid JSON, no markdown):
{
  "corrected_text": "the corrected sentence here",
  "explanation": ["First change explained", "Second change explained"],
  "alternatives": ["Alternative 1", "Alternative 2"],
  "tone": "formal/neutral/friendly",
  "confidence_score": 0.95,
  "timestamp": "${new Date().toISOString()}"
}
`;

export const PROFESSIONAL_PROMPT = (text: string, tone: string = 'formal', userPreferences?: any) => `
You are a workplace communication coach. Rewrite the input text to be professional, polished, and appropriate for workplace communication.

User's text: "${text}"

Desired tone: ${tone}
User preferences:
- Domain: ${userPreferences?.domain || 'general'}
- Level: ${userPreferences?.level || 'intermediate'}

Rewrite this to be clear, concise, professional, and ${tone}. Make it suitable for workplace emails, messages, or documents.

Provide your response in this exact JSON format (return ONLY valid JSON, no markdown):
{
  "corrected_text": "the professionally rewritten sentence here",
  "explanation": ["What was improved", "Why this version is better"],
  "alternatives": ["Alternative professional version 1", "Alternative professional version 2"],
  "tone": "${tone}",
  "confidence_score": 0.95,
  "timestamp": "${new Date().toISOString()}"
}
`;

export const ROLEPLAY_SYSTEM_PROMPT = `You are a realistic workplace colleague. Respond naturally and professionally to messages. Keep responses concise (2-3 sentences max). When the user says "end" or the conversation naturally concludes, provide feedback.`;

export const ROLEPLAY_PROMPT = (scenario: string, userMessage: string, conversationHistory: any[], isEnd: boolean = false) => {
  if (isEnd) {
    return `
Conversation scenario: ${scenario}

Conversation history:
${conversationHistory.map((msg, i) => `${i + 1}. ${msg.role}: ${msg.content}`).join('\n')}

The conversation has ended. Provide detailed feedback in this exact JSON format (return ONLY valid JSON, no markdown):
{
  "feedback": "Overall assessment of the conversation",
  "scores": {
    "clarity": 85,
    "tone": 90,
    "conciseness": 80,
    "politeness": 95
  },
  "improvements": ["Improvement suggestion 1", "Improvement suggestion 2", "Improvement suggestion 3"],
  "best_parts": ["What you did well 1", "What you did well 2"]
}
`;
  }

  return `
You are a realistic workplace colleague in this scenario: ${scenario}

Conversation history:
${conversationHistory.map((msg, i) => `${i + 1}. ${msg.role}: ${msg.content}`).join('\n')}

User's message: "${userMessage}"

Respond naturally and professionally as a colleague would. Keep it brief (2-3 sentences). Return response in this exact JSON format (return ONLY valid JSON, no markdown):
{
  "response": "Your response as a colleague here"
}
`;
};

export const DAILY_TASK_PROMPT = (userPreferences?: any) => `
Generate 3 short English practice tasks for today. Make them practical and useful for workplace communication.

User preferences:
- Domain: ${userPreferences?.domain || 'general'}
- Level: ${userPreferences?.level || 'intermediate'}

Provide tasks in this exact JSON format (return ONLY valid JSON, no markdown):
{
  "tasks": [
    {
      "id": "task-1",
      "type": "rewrite",
      "instruction": "Rewrite this sentence formally",
      "content": "can u send me the report asap",
      "answer": "Could you please send me the report at your earliest convenience?"
    },
    {
      "id": "task-2",
      "type": "choice",
      "instruction": "Choose the correct preposition",
      "content": "I will arrive ___ the office at 9 AM",
      "options": ["in", "at", "on", "to"],
      "answer": "at"
    },
    {
      "id": "task-3",
      "type": "fill",
      "instruction": "Fill in the blank with appropriate word",
      "content": "Thank you for your ___ response to my inquiry",
      "answer": "prompt"
    }
  ],
  "generated_at": "${new Date().toISOString()}"
}
`;
