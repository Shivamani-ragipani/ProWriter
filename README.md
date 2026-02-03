# ProWriter - Intelligent English Sentence Correction & Workplace Communication Coach

A clean, simple, and polished web application that helps users convert rough or incorrect English sentences into grammatically correct, professional, and context-appropriate English.

## Features

### 1. Grammar Correction
- **Just Grammar Mode**: Minimal corrections only (grammar, spelling, punctuation)
- **Rewrite Professionally Mode**: Polished, workplace-ready rewrites
- Tone selection (formal, neutral, friendly)
- Detailed explanations of changes
- Alternative versions provided
- Confidence scoring

### 2. Daily Growth
- AI-generated daily micro-practice tasks
- Three types of exercises:
  - Rewrite sentences formally
  - Choose correct words/prepositions
  - Fill-in-the-blank challenges
- Streak tracking
- Progress monitoring
- LocalStorage-based persistence

### 3. Workplace Communication Practice
- Interactive role-play scenarios:
  - Project status updates
  - Apology emails
  - Meeting invitations
  - Slack quick replies
  - Peer feedback
- Multi-turn conversations with AI
- Performance feedback with scores:
  - Clarity
  - Tone
  - Conciseness
  - Politeness
- Improvement suggestions
- Copy final message feature

### 4. Profile & Preferences
- Customize tone preference (formal, neutral, friendly)
- Select work domain (engineering, product, general, sales, support)
- Set English level (beginner, intermediate, advanced)
- All data stored locally in browser
- Clear all data option

## Tech Stack

- **Frontend & Backend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **AI Integration**: Gemini Pro 2.5 (Google Generative AI)
- **State Management**: React hooks + localStorage
- **Database**: None (lightweight, local-only storage)
- **Authentication**: None

## Project Structure

```
/app
├── /api
│   ├── /correct        # Grammar correction & professional rewrite
│   ├── /practice       # Role-play chat API
│   └── /daily          # Daily tasks generation
├── /app
│   ├── page.tsx        # Main page with tabs
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── /components
│   ├── /features       # Feature components
│   │   ├── GrammarCorrection.tsx
│   │   ├── DailyGrowth.tsx
│   │   ├── WorkplacePractice.tsx
│   │   └── Profile.tsx
│   └── /ui             # shadcn/ui components
├── /lib
│   ├── /gemini
│   │   ├── client.ts   # Gemini API client
│   │   └── prompts.ts  # Prompt templates
│   ├── scenarios.ts    # Workplace scenarios
│   ├── storage.ts      # localStorage utilities
│   └── utils.js        # Utility functions
└── /public
```

## How to Run Locally

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **Package Manager**: npm or yarn
- **Gemini API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation Steps

1. **Clone or download the project**

```bash
cd /app
```

2. **Install dependencies**

```bash
yarn install
# or
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Start the development server**

```bash
yarn dev
# or
npm run dev
```

5. **Open in browser**

Navigate to [http://localhost:3000](http://localhost:3000)

The application should now be running!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

**Important**: Never commit your `.env.local` file or expose your API key publicly.

## Usage Guide

### Grammar Correction
1. Navigate to the "Grammar" tab
2. Enter your text in the textarea
3. Choose correction mode (Just Grammar or Rewrite Professionally)
4. Select tone if using professional mode
5. Click "Correct My Text"
6. Review corrected text, explanations, and alternatives

### Daily Growth
1. Navigate to the "Daily Growth" tab
2. Click "Generate Tasks" to get today's challenges
3. Complete each task (rewrite, choice, or fill-in-the-blank)
4. Check your answers
5. Track your streak and progress

### Workplace Practice
1. Navigate to the "Practice" tab
2. Select a workplace scenario
3. Click "Start Practice"
4. Type your messages and have a conversation
5. Click "End & Get Feedback" when done
6. Review your performance scores and suggestions
7. Copy your final message if needed

### Profile
1. Navigate to the "Profile" tab
2. Set your preferred tone, work domain, and English level
3. Click "Save Preferences"
4. These preferences personalize AI responses across all features

## Features Highlights

- ✅ **No Login Required**: Start using immediately
- ✅ **Privacy-First**: All data stored locally in your browser
- ✅ **Offline-Ready**: Preferences and progress saved locally
- ✅ **AI-Powered**: Uses latest Gemini Pro 2.5 model
- ✅ **Professional UI**: Clean, modern design with Tailwind CSS
- ✅ **Responsive**: Works on desktop, tablet, and mobile
- ✅ **Real-time Feedback**: Instant corrections and suggestions

## API Routes

### POST /api/correct
Correct or rewrite text with AI

**Request Body:**
```json
{
  "text": "the text to correct",
  "mode": "grammar" | "professional",
  "tone": "formal" | "neutral" | "friendly",
  "userPreferences": { ... }
}
```

### POST /api/practice
Role-play workplace scenarios

**Request Body:**
```json
{
  "scenario": "scenario description",
  "userMessage": "user's message",
  "conversationHistory": [ ... ],
  "isEnd": false
}
```

### POST /api/daily
Generate daily practice tasks

**Request Body:**
```json
{
  "userPreferences": { ... }
}
```

## Development

### Build for Production

```bash
yarn build
# or
npm run build
```

### Start Production Server

```bash
yarn start
# or
npm start
```

## Notes

- **No Database**: All data is stored in browser localStorage
- **No Authentication**: No user accounts or login system
- **Server-Side AI**: All Gemini API calls happen on the server (API routes)
- **Security**: API key is never exposed to the client
- **Lightweight**: Minimal dependencies, fast performance

## Troubleshooting

### API Key Error
- Ensure `GEMINI_API_KEY` is set in `.env.local`
- Restart the dev server after adding environment variables
- Verify the API key is valid on Google AI Studio

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `yarn install` again
- Clear browser cache

### localStorage Issues
- Check browser privacy settings
- Try a different browser
- Clear site data and refresh

## License

This is a demonstration project. Feel free to use and modify as needed.

## Support

For issues or questions, please check the troubleshooting section above or review the code comments for implementation details.

---

**Built with ❤️ using Next.js, TypeScript, and Gemini AI**
