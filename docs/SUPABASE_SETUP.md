# Supabase Authentication Setup

Proyek ini telah dimigrasi dari Next-auth ke Supabase Auth dengan Google SSO.

## Setup Supabase

### 1. Buat Proyek Supabase
1. Kunjungi [https://supabase.com](https://supabase.com)
2. Klik "Start your project" dan buat akun baru atau login
3. Klik "New Project"
4. Pilih organisasi dan masukkan detail proyek:
   - Name: `logic-gate` (atau nama lain)
   - Database Password: (buat password yang kuat)
   - Region: Southeast Asia (Singapore) untuk latensi optimal
5. Klik "Create new project" dan tunggu setup selesai

### 2. Konfigurasi Environment Variables
1. Copy file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Buka Supabase dashboard proyek Anda
3. Navigasi ke Settings > API
4. Copy dan paste nilai berikut ke `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon public key

### 3. Setup Google OAuth
1. Di Supabase dashboard, navigasi ke Authentication > Providers
2. Cari "Google" dan klik enable
3. Buat Google OAuth App:
   - Kunjungi [Google Cloud Console](https://console.cloud.google.com/)
   - Buat project baru atau pilih existing project
   - Enable Google+ API
   - Buat OAuth 2.0 credentials (Web application)
   - Tambahkan authorized redirect URI:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
4. Copy Client ID dan Client Secret dari Google ke Supabase Google provider settings
5. Save configuration

### 4. Setup Redirect URLs
1. Di Supabase Authentication settings, tambahkan redirect URLs:
   - Development: `http://localhost:3000/dashboard`
   - Production: `https://your-domain.com/dashboard`

## Fitur yang Tersedia

### Authentication
- ✅ Google SSO (Single Sign-On)
- ✅ Automatic session management
- ✅ Protected routes dengan middleware
- ✅ Logout functionality

### Removed Features
- ❌ Email/password authentication (disederhanakan ke Google SSO only)
- ❌ Manual signup form

## Komponen yang Diupdate

### Migrasi dari Next-auth
- `src/lib/auth.ts` - Diganti dengan Supabase auth utilities
- `src/providers/auth-provider.tsx` - Context provider untuk Supabase
- `src/middleware.ts` - Middleware untuk protected routes
- `src/components/login-form.tsx` - Simplified untuk Google SSO only
- `src/app/signup/page.tsx` - Simplified untuk Google SSO only

### Hooks dan Utilities
- `useAuth()` - Hook untuk mengakses user state dan auth functions
- `signInWithGoogle()` - Function untuk Google OAuth
- `signOut()` - Function untuk logout
- `user` - Current user object dari Supabase

## Testing

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Type Check
```bash
npm run type-check
```

## Troubleshooting

### Common Issues

1. **"Invalid URL" error**
   - Pastikan `NEXT_PUBLIC_SUPABASE_URL` sudah diset dengan benar
   - Format: `https://your-project-id.supabase.co`

2. **"Invalid API key" error**
   - Pastikan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah diset dengan benar
   - Gunakan anon/public key, bukan service role key

3. **Google OAuth tidak bekerja**
   - Pastikan Google provider sudah dienable di Supabase
   - Pastikan redirect URL sudah ditambahkan di Google Cloud Console
   - Pastikan domain sudah ditambahkan di allowed origins

4. **Redirect loop**
   - Cek middleware configuration
   - Pastikan public paths sudah benar
   - Cek redirect URLs di Supabase settings

### Logs and Debugging
- Cek browser console untuk error messages
- Cek Supabase logs di dashboard > Logs
- Enable debug mode dengan menambahkan `console.log` di auth provider

## Security Notes

- Anon key aman untuk digunakan di client-side
- Jangan expose service role key di frontend
- Gunakan Row Level Security (RLS) di Supabase untuk data protection
- Regularly rotate API keys jika diperlukan
