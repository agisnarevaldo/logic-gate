# Deployment Guide untuk Vercel

## 🚀 Steps untuk Deploy ke Vercel

### 1. Push ke GitHub
```bash
git add .
git commit -m "Fix build errors for Vercel deployment"
git push origin main
```

### 2. Setup Vercel Project
1. Login ke [vercel.com](https://vercel.com)
2. Import repository GitHub Anda
3. Framework akan auto-detect sebagai "Next.js"

### 3. Environment Variables di Vercel
Tambahkan environment variables berikut di Vercel Dashboard:

**Required:**
```
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Optional (untuk Google OAuth):**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Build Settings (Auto-detected)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Deploy
Klik "Deploy" - Vercel akan:
1. Install dependencies
2. Run type checking
3. Build aplikasi
4. Deploy ke production

## 🔧 Build Fixes yang Telah Dilakukan

### TypeScript Errors Fixed:
- ✅ Unused variables di `layout.tsx`
- ✅ Unused variables di `middleware.ts`  
- ✅ `any` type di `logic-gate-simulator.tsx`
- ✅ Unused parameters di berbagai components
- ✅ Parameter types di callback functions

### Production Optimizations:
- ✅ Added `vercel-build` script
- ✅ Added `type-check` script
- ✅ Created `vercel.json` configuration
- ✅ Added `.env.example` template

## 🐛 Troubleshooting

### Jika Build Masih Gagal:
1. Check Vercel build logs untuk error spesifik
2. Pastikan semua environment variables ter-set
3. Coba local build: `npm run vercel-build`

### Common Issues:
- **Missing NEXTAUTH_SECRET**: Add ke environment variables
- **TypeScript errors**: Check dengan `npm run type-check`
- **Import errors**: Check file paths dan exports

## 📱 Post-Deployment

### Update Google OAuth (jika menggunakan):
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Update Authorized redirect URIs:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

### Update NEXTAUTH_URL:
1. Di Vercel dashboard, update environment variable:
   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

### Custom Domain (Optional):
1. Di Vercel dashboard → Settings → Domains
2. Add custom domain
3. Update NEXTAUTH_URL accordingly

## ✅ Verification

Setelah deploy, test:
- [ ] Homepage loading
- [ ] Login functionality  
- [ ] Dashboard access
- [ ] Simulator working
- [ ] Mobile responsiveness

Aplikasi siap deploy! 🎉
