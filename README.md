# 🎨 ETHMumbai Avatar Creator

> Generate your personalized ETHMumbai avatar powered by Google Gemini AI

A web application that transforms your photos into custom cartoon avatars featuring iconic Mumbai and Thane landmarks. Built for ETHMumbai 2026, this app creates unique, culturally-rich avatars that celebrate the spirit of Mumbai's Web3 community.

![ETHMumbai Avatar Creator](public/images/sample1.png)

## ✨ Features

- 🤖 **AI-Powered Generation** - Uses Google Gemini 3 Pro Image Preview for high-quality avatar creation
- 🏙️ **Cultural Elements** - Incorporates Mumbai landmarks (Gateway of India, BEST buses, vada pav) and Thane icons
- 🎟️ **Ticket Machine Interface** - Retro-styled UI inspired by ticket counters
- 🖼️ **Avatar Gallery** - Browse and download all generated avatars
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔗 **Social Sharing** - Share your avatar on Twitter, LinkedIn, or copy the link
- ⚡ **Real-time Generation** - Fast avatar creation with loading states and error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Lovable AI Gateway API key (for Gemini access)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gemini-avatar-creator-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Configure Supabase**
   
   - Create a new Supabase project
   - Create an `avatars` table:
     ```sql
     create table avatars (
       id uuid default gen_random_uuid() primary key,
       name text not null,
       generated_image_url text not null,
       created_at timestamp with time zone default timezone('utc'::text, now()) not null
     );
     ```
   - Create a storage bucket named `avatars` with public access
   - Deploy the edge function:
     ```bash
     cd supabase/functions/generate-avatar
     supabase functions deploy generate-avatar
     ```
   - Set edge function secrets:
     ```bash
     supabase secrets set LOVABLE_API_KEY=your_lovable_api_key
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │TicketMachine │  │   Gallery    │  │GeneratedAvatar│      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                  │                                  │
└─────────┼──────────────────┼──────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Edge Function   │  │  PostgreSQL  │  │   Storage    │  │
│  │ (Deno Runtime)   │  │   Database   │  │   Bucket     │  │
│  └────────┬─────────┘  └──────────────┘  └──────────────┘  │
└───────────┼──────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│              Lovable AI Gateway                              │
│                        ▼                                      │
│              Google Gemini 3 Pro Image                       │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router v6
- React Query (data fetching)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Storage (image hosting)
- Supabase Edge Functions (Deno runtime)

**AI:**
- Google Gemini 3 Pro Image Preview
- Lovable AI Gateway

## 📂 Project Structure

```
gemini-avatar-creator-main/
├── public/
│   └── images/              # Static images (logo, samples, skyline)
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (49 components)
│   │   ├── TicketMachine.tsx    # Avatar creation interface
│   │   ├── GeneratedAvatar.tsx  # Display & share generated avatar
│   │   ├── Marquee.tsx          # Scrolling banner
│   │   └── Skyline.tsx          # Background decoration
│   ├── pages/
│   │   ├── Index.tsx        # Landing page
│   │   ├── Gallery.tsx      # Avatar gallery
│   │   └── NotFound.tsx     # 404 page
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   ├── hooks/               # Custom React hooks
│   ├── App.tsx              # Main app component
│   └── index.css            # Global styles & animations
├── supabase/
│   └── functions/
│       └── generate-avatar/ # Edge function for AI generation
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## 🎨 How It Works

1. **User Input**: User enters their name and uploads a photo
2. **Validation**: Frontend validates file size (max 5MB) and required fields
3. **Edge Function Call**: Photo (base64) and name sent to Supabase edge function
4. **AI Generation**: Edge function calls Gemini AI with detailed prompt including:
   - Extract person from photo and convert to cartoon style
   - Add Mumbai/Thane cultural elements (Gateway of India, BEST bus, vada pav, etc.)
   - Place user's name on the avatar
5. **Storage**: Generated image uploaded to Supabase Storage
6. **Database**: Avatar record saved with public URL
7. **Display**: User sees their avatar with download and share options

## 🎯 Avatar Generation Prompt

The AI uses a detailed prompt to ensure consistent, high-quality avatars:

- **Canvas**: 1500×1500px square
- **Person Style**: Clean cartoon with smooth outlines, flat colors, natural proportions
- **Background**: Red (#E2231A) with white line-art icons
- **Mumbai Icons**: Gateway of India, CST, Bandra-Worli Sea Link, Marine Drive, BEST bus, auto rickshaw, vada pav, cutting chai
- **Thane Icons**: Thane Creek, Upvan Lake, Thane skyline
- **Name Placement**: Bottom-left corner in white bold text

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🌐 Deployment

### Frontend Deployment

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run database migrations
3. Deploy edge functions using Supabase CLI
4. Configure storage bucket with public access

## 🔐 Environment Variables

### Frontend (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

### Edge Function Secrets

Set via Supabase CLI:

```bash
supabase secrets set LOVABLE_API_KEY=your_api_key
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📸 Screenshots

### Landing Page
![Landing Page](public/images/sample1.png)

### Avatar Gallery
Browse all generated avatars with hover effects and download options.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **ETHMumbai** - For inspiring this project
- **Google Gemini** - For powerful AI image generation
- **Supabase** - For seamless backend infrastructure
- **shadcn/ui** - For beautiful UI components

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for ETHMumbai 2026**
