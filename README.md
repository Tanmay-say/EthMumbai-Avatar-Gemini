# ETHMumbai Avatar Creator

## Project Overview

ETHMumbai Avatar Creator is a web application that generates personalized Mumbai-themed avatars using Google Gemini AI. Users can upload their photo and name to create a unique avatar featuring Mumbai landmarks and cultural elements.

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account and project
- Google Gemini API access

### Installation

Follow these steps to set up the project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd gemini-avatar-creator

# Step 3: Install the necessary dependencies
npm install

# Step 4: Set up environment variables
# Create a .env file with:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# Step 5: Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

For the Supabase Edge Function, set these environment variables in your Supabase dashboard:

```env
GEMINI_API_KEY=your_gemini_api_key
AI_API_URL=your_ai_gateway_url  # e.g., https://your-ai-gateway.com/v1/chat/completions
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Note:** The Edge Function uses an AI Gateway endpoint. You'll need to configure your own AI API endpoint or use a compatible service that supports the Gemini image generation model.

## What technologies are used for this project?

This project is built with:

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Styling
- **Supabase** - Backend (Database, Storage, Edge Functions)
- **Google Gemini AI** - Avatar generation

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/         # Route pages
│   ├── integrations/  # Supabase client
│   └── lib/           # Utilities
├── supabase/
│   ├── functions/     # Edge Functions
│   └── migrations/    # Database migrations
└── public/            # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How can I deploy this project?

### Deploy to Vercel/Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Set environment variables in your hosting platform

### Deploy Supabase Edge Functions

```sh
supabase functions deploy generate-avatar
```

## Features

- 🎨 Generate personalized Mumbai-themed avatars
- 📸 Upload and process user photos
- 🖼️ Gallery of all generated avatars
- 📥 Download avatars
- 🔗 Share avatars on social media
- 🎯 Responsive design

## License

MIT
