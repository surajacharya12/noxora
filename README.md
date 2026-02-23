# Nexora Streaming Platform

Nexora is a premium, high-performance streaming application designed for a cinematic entertainment experience. Built with a modern tech stack, it features a sleek dark-mode UI, real-time data integration, and personal user features like watch history and wishlists.

## 🚀 Key Features

- **Cinematic Hero Banner**: Dynamic hero section featuring trending content with high-definition backdrops.
- **Continue Watching**: Personalized row on the home page tracking your most recently viewed movies and series with progress indicators.
- **Multi-Category Discovery**: Specialized sections for Trending Now, Top 10 Today, Popular Movies, and Must-Watch Series.
- **Advanced Search**: Global search bar with glowing effects and real-time results.
- **Personalized Profile**: Manage your account details and update your password securely.
- **Smart Wishlist**: Add and remove titles from your personal collection across the platform.
- **Responsive Player**: Integrated cinematic player for both movies and TV series.
- **Deployment Ready**: Fully configured for Vercel deployment (Serverless Backend + Next.js Frontend).

## 🛠️ Technology Stack

### Frontend (nexora_client)

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks (useEffect, useState)

### Backend (nexora_server)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & Bcryptjs
- **Data Source**: TMDB (The Movie Database) API

## 📦 Project Structure

```text
Nexora/
├── nexora_client/      # Next.js Frontend
│   ├── app/            # App router components and pages
│   ├── public/         # Static assets (logos, images)
│   └── utils/          # API helper functions
└── nexora_server/      # Express.js Backend
    ├── config/         # Database configuration
    ├── models/         # Mongoose schemas
    ├── routes/         # API endpoints
    └── index.js        # Server entry point
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account
- TMDB API Key

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/surajacharya12/noxora.git
   cd Nexora
   ```

2. **Setup Server**:

   ```bash
   cd nexora_server
   npm install
   # Create a .env file with:
   # MONGO_URI, TMDB_API_KEY, TMDB_BASE_URL, JWT_SECRET
   npm run dev
   ```

3. **Setup Client**:
   ```bash
   cd ../nexora_client
   npm install
   # Create a .env file with:
   # NEXT_PUBLIC_API_URL=http://localhost:3001/api
   npm run dev
   ```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the Nexora Team.
