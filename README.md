# LogiFun - Logic Gate Learning Platform

![LogiFun Banner](public/images/decoration.svg)

LogiFun adalah platform pembelajaran interaktif untuk mempelajari gerbang logika dan elektronika digital. Platform ini menyediakan berbagai fitur edukasi mulai dari materi pembelajaran, simulator interaktif, hingga quiz dan games.

## 🌟 Fitur Utama

### 📚 **Materi Pembelajaran**
- **Pengantar Gerbang Logika**: Konsep dasar dan sejarah gerbang logika
- **Sistem Bilangan Digital**: Biner, desimal, dan heksadesimal
- **Aljabar Boolean**: Operasi dan hukum-hukum Boolean
- **Gerbang Logika Dasar**: AND, OR, NOT dan implementasinya

### 🔬 **Simulator Interaktif**
- **Drag & Drop Interface**: Tarik komponen dari toolbar ke canvas
- **Real-time Simulation**: Simulasi langsung saat menghubungkan komponen
- **Gerbang yang Tersedia**:
  - INPUT/OUTPUT nodes
  - Basic gates: AND, OR, NOT
  - Advanced gates: NAND, NOR, XOR, XNOR
- **Canvas Controls**:
  - Zoom in/out dan pan
  - Touch support untuk mobile
  - Wire connection dengan visual feedback

### 🧠 **Sistem Quiz**
- **Logic Gate Matching**: Cocokkan simbol gerbang dengan namanya
- Scoring system dan feedback interaktif

### 🎮 **Games & Activities**
- Logic Gate Puzzle
- Circuit Builder
- Logic Challenge

### 👤 **Autentikasi & User Management**
- Login dengan credentials atau Google OAuth
- Session management dengan NextAuth.js
- Protected routes dan middleware

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.0 dengan React 19
- **Styling**: TailwindCSS 4.0 + Tailwind Animate
- **UI Components**: Radix UI (Label, Slot)
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion alternative)

### Simulator
- **Flow Diagram**: ReactFlow 11.11.4
- **Canvas Rendering**: Custom HTML5 Canvas implementation
- **State Management**: React Hooks (useState, useCallback, useRef)

### Authentication
- **Auth Provider**: NextAuth.js 4.24.11
- **OAuth**: Google Provider
- **Credentials**: Custom credentials provider

### Development
- **Language**: TypeScript 5
- **Build Tool**: Next.js dengan Turbopack
- **Linting**: ESLint 9 + Next.js config
- **Package Manager**: npm/pnpm

### Utilities
- **Styling**: class-variance-authority, clsx, tailwind-merge
- **Markdown**: react-markdown 10.1.0
- **UUID**: uuid 11.1.0

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm atau pnpm

### Clone Repository
```bash
git clone <repository-url>
cd logic-gate
```

### Install Dependencies
```bash
npm install
# atau
pnpm install
```

### Environment Setup
Buat file `.env.local` di root directory:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Development Server
```bash
npm run dev
# atau dengan turbopack
npm run dev --turbopack
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📱 Platform Support

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **Touch Support**: Full touch interaction untuk mobile devices
- **Responsive Design**: Optimized untuk berbagai ukuran layar

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── simulator/         # Logic gate simulator
│   ├── materi/           # Learning materials
│   ├── kuis/             # Quiz system
│   ├── game/             # Games section
│   └── api/auth/         # NextAuth configuration
├── components/            # Reusable components
│   ├── simulator/        # Simulator-specific components
│   ├── quiz/            # Quiz components
│   └── ui/              # Base UI components
├── data/                 # Static data
│   └── learning-materials.ts
├── hooks/                # Custom React hooks
│   └── use-simulator.ts  # Simulator logic hook
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── providers/            # Context providers
```

## 🎯 Core Features Deep Dive

### Logic Gate Simulator
- **Component System**: Modular gate components dengan input/output ports
- **Connection System**: Visual wire connections dengan bezier curves
- **Real-time Logic**: Automatic propagation dan calculation
- **Mobile Optimized**: Touch gestures untuk drag, zoom, dan pan

### Learning Materials
- **Structured Content**: Hierarchical categories dan modules
- **Markdown Support**: Rich text content dengan syntax highlighting
- **Progressive Learning**: Ordered modules dengan navigation

### Authentication System
- **Multiple Providers**: Credentials + Google OAuth
- **Session Management**: JWT-based sessions dengan encryption
- **Route Protection**: Middleware-based route guards

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev --turbopack  # Start with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 📈 Performance Features

- **Turbopack**: Fast refresh dan optimized bundling
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts dengan next/font

## 🐛 Known Issues & Solutions

### JWT Session Error
Jika mengalami JWT session error:
1. Clear browser cookies dan localStorage
2. Restart development server
3. Akses `/clearSession=true` untuk clear corrupted sessions

### Mobile Touch Issues
- Gunakan `touch-manipulation` CSS class
- Disable browser zoom dengan viewport meta

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Muhamad Agisna Revaldo**
- Project: LogiFun - Logic Gate Learning Platform
- Built with Next.js, React, dan TailwindCSS

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **ReactFlow** - Flow diagram library
- **Radix UI** - Accessible UI components
- **Lucide** - Beautiful icon set
- **TailwindCSS** - Utility-first CSS framework

---

**LogiFun** - Making logic gates fun and accessible for everyone! 🚀
