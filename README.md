# NutriSnap

AI-powered nutrition tracking app. Take a photo of your meal and get instant calorie and macro estimates.

## Features

- **AI Meal Photo Analysis** — snap a photo, AI identifies foods and estimates calories/macros
- **Dual AI Support** — works with both Claude (Anthropic) and OpenAI (GPT-4o)
- **Manual Entry** — log food manually when you prefer
- **Editable Results** — adjust weight, calories, and macros after AI analysis
- **Clarifying Questions** — AI asks about portions/ingredients, you answer and re-analyze
- **Daily Goals** — set custom targets for calories, protein, carbs, and fat
- **Dashboard** — circular progress ring and macro bars for daily tracking
- **History** — calendar view to browse and edit past meals
- **Analytics** — 7-day trends, weekly comparisons, goal vs actual charts
- **Offline Ready** — data stored locally in your browser (localStorage)

## How to Use

1. Open `index.html` in any modern browser (Chrome, Safari, Firefox)
2. Complete the setup wizard (choose AI provider, enter API key, set goals)
3. Start logging meals with photos or manual entry

## API Keys

You'll need an API key from one of:
- [Anthropic Console](https://console.anthropic.com) (for Claude)
- [OpenAI Platform](https://platform.openai.com) (for GPT-4o)

API keys are entered at runtime and stored only in your browser's localStorage. They are never included in the source code.

## Tech Stack

- Single HTML file (no build tools, no server required)
- Tailwind CSS via CDN
- Chart.js via CDN
- Vanilla JavaScript
- localStorage for data persistence
