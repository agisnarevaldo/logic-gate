# Supabase Auth Setup Guide

## Overview

Aplikasi LogiFun telah berhasil diupgrade dari Next-auth ke Supabase Auth dengan fitur Google SSO yang simple dan modern.

## Perubahan Utama

### 1. Package yang Digunakan
- **Dihapus**: `next-auth` (deprecated)
- **Ditambah**: `@supabase/supabase-js` dan `@supabase/ssr`

### 2. Fitur Authentication
- **Single Sign-On (SSO) dengan Google**: Hanya menggunakan Google sebagai provider login
- **Session Management**: Otomatis dikelola oleh Supabase
- **Security**: Built-in CSRF protection dan secure cookie handling

## Setup Supabase

### 1. Buat Project Supabase
1. Kunjungi [supabase.com](https://supabase.com)
2. Buat akun/login
3. Klik "New Project"
4. Pilih organization dan isi detail project
5. Tunggu project selesai dibuat (~2 menit)

### 2. Konfigurasi Google OAuth

#### Di Google Cloud Console:
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih existing project
3. Aktifkan Google+ API
4. Pergi ke "Credentials" → "Create Credentials" → "OAuth client ID"
5. Pilih "Web application"
6. Tambahkan domain berikut di "Authorized redirect URIs":
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
7. Salin **Client ID** dan **Client Secret**

#### Di Supabase Dashboard:
1. Pergi ke Authentication → Providers
2. Pilih Google dan aktifkan
3. Masukkan **Client ID** dan **Client Secret** dari Google
4. Simpan konfigurasi

### 3. Environment Variables

Copy file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan nilai dari Supabase dashboard (Settings → API):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Site URL Configuration

Di Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `http://localhost:3000` (development) atau domain production
- **Redirect URLs**: 
  - `http://localhost:3000/dashboard` (development)
  - `https://yourdomain.com/dashboard` (production)

## Testing

### 1. Development
```bash
npm run dev
```

### 2. Build Production
```bash
npm run build
npm start
```

### 3. Verifikasi Login Flow
1. Akses halaman login
2. Klik "Continue with Google"
3. Login dengan akun Google
4. Harus redirect ke `/dashboard`
5. Test logout dari dashboard

## Arsitektur Baru

### 1. Auth Provider (`src/providers/auth-provider.tsx`)
- Menggunakan `createClient` dari `@supabase/supabase-js`
- Mengelola state user dan loading
- Hanya menyediakan `signInWithGoogle()` dan `signOut()`

### 2. Login Form (`src/components/login-form.tsx`)
- UI yang bersih hanya dengan tombol Google
- Error handling
- Loading states

### 3. Middleware (`src/middleware.ts`)
- Menggunakan `@supabase/ssr` untuk server-side auth
- Melindungi route yang memerlukan authentication
- Redirect otomatis berdasarkan status login

### 4. User Profile (`src/components/user-profile.tsx`)
- Menggunakan data dari `user.user_metadata`
- Fallback untuk nama dan avatar

## Keuntungan Supabase Auth

1. **Simplicity**: Setup yang lebih mudah dibanding Next-auth
2. **Performance**: Built-in optimizations untuk SSR
3. **Security**: Enterprise-grade security features
4. **Scalability**: Hosted service yang auto-scale
5. **Modern**: Menggunakan teknologi terbaru (@supabase/ssr)

## Troubleshooting

### Error: "User not found"
- Pastikan environment variables sudah benar
- Cek apakah Google OAuth sudah dikonfigurasi dengan benar

### Error: "Invalid redirect URL"
- Pastikan redirect URLs sudah ditambahkan di Supabase dan Google Console
- Cek Site URL configuration di Supabase

### Build errors
- Pastikan semua dependencies sudah terinstall
- Jalankan `npm run type-check` untuk melihat error TypeScript

## Support

Untuk dokumentasi lengkap Supabase Auth:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
