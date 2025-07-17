# Troubleshooting Academic Scoring System

## Error: "Error completing quiz attempt: {}"

Jika Anda melihat error ini, kemungkinan penyebabnya adalah:

### 1. Environment Variables Belum Diatur

Pastikan file `.env.local` sudah dibuat dengan konfigurasi Supabase:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema Belum Dijalankan

Pastikan Anda sudah menjalankan SQL schema di Supabase Dashboard:

1. Buka Supabase Dashboard → SQL Editor
2. Copy-paste isi file `supabase-academic-scoring-schema.sql`
3. Klik "Run" untuk mengeksekusi schema

### 3. RLS (Row Level Security) Policies

Pastikan RLS policies sudah dijalankan dengan benar. Schema sudah include policies yang diperlukan.

### 4. User Authentication

Pastikan user sudah login sebelum mengakses quiz. Sistem academic scoring memerlukan user yang terautentikasi.

## Debugging Steps

### Step 1: Check Environment
```bash
# Jalankan di terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Step 2: Check Database Connection
Tambahkan komponen debug ke halaman dashboard:
```tsx
import { DebugAcademicPanel } from '@/components/debug/debug-academic-panel'

// Tambahkan di komponen
<DebugAcademicPanel />
```

### Step 3: Manual Testing di Browser Console
```javascript
// Jalankan di browser console
debugAcademicSystem()
```

### Step 4: Check Supabase Dashboard

1. **Table Editor**: Pastikan semua tabel sudah terbuat:
   - `quiz_types`
   - `quiz_attempts` 
   - `user_learning_stats`
   - `topic_progress`

2. **Authentication**: Pastikan ada user yang login

3. **Logs**: Check Real-time logs untuk melihat error details

## Common Issues & Solutions

### Issue: "Quiz type not found"
**Solution**: Pastikan data `quiz_types` sudah diinsert:
```sql
SELECT * FROM quiz_types WHERE code = 'GATE_SYMBOLS';
```

### Issue: "User not authenticated"
**Solution**: Pastikan user sudah login dan session masih valid.

### Issue: "Permission denied for table"
**Solution**: Check RLS policies di Supabase Dashboard → Authentication → Policies

### Issue: Database constraints violation
**Solution**: Check tipe data yang dikirim sesuai dengan schema:
- `score`: DECIMAL(5,2)
- `percentage`: Auto-generated, jangan kirim manual
- `grade`: VARCHAR(2)

## Testing Checklist

- [ ] Environment variables sudah diatur
- [ ] Database schema sudah dijalankan
- [ ] User sudah login
- [ ] Table `quiz_types` ada data
- [ ] RLS policies aktif
- [ ] Browser console tidak ada error CORS
- [ ] Network tab menunjukkan request ke Supabase berhasil

## Contact

Jika masih ada masalah, check:
1. Supabase project status
2. API keys validity
3. Database connection limits
4. Browser console untuk error details
