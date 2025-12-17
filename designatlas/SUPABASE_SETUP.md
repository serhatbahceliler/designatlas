# Supabase Setup Guide

Bu dosya, DesignAtlas projesinin dashboard özelliklerinin çalışması için gerekli Supabase veritabanı kurulumunu açıklar.

## 1. Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://app.supabase.com)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adı ve database şifrenizi belirleyin
4. Proje oluşturulduktan sonra Settings > API sayfasından:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   değerlerini kopyalayın

## 2. Environment Variables Kurulumu

Projenizin ana dizininde `.env.local` dosyası oluşturun:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Veritabanı Şemasını Oluşturma

1. Supabase Dashboard'da SQL Editor'ü açın
2. `supabase-schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın ve "Run" butonuna tıklayın

Bu şema şunları oluşturur:
- ✅ `user_quiz_results` - Quiz sonuçları ve önerilen roadmap
- ✅ `user_roadmaps` - Kullanıcının takip ettiği roadmap'ler
- ✅ `user_progress` - Her roadmap'teki adım ilerlemesi
- ✅ `user_streaks` - Öğrenme serisi (streak) bilgisi
- ✅ `user_bookmarks` - Bookmark'lar (ileride kullanım)
- ✅ `user_notes` - Notlar (ileride kullanım)

## 4. Authentication Setup

Supabase Authentication zaten aktif olmalı. Email/Password authentication'ın açık olduğundan emin olun:

1. Authentication > Settings > Auth Providers
2. Email Provider'ın enabled olduğunu kontrol edin

## 5. Test Data Ekleme

### Segment 1 Testi (0% Kullanıcı)
Quiz sonucu olan ama hiç ilerleme kaydetmemiş kullanıcı:

```sql
-- Kullanıcı register olduktan sonra quiz sonucunu ekleyin:
INSERT INTO user_quiz_results (user_id, quiz_data, recommended_roadmap)
VALUES (
  'your-user-id-here',
  '{"questions": [], "answers": []}',
  'ux'
);
```

### Segment 2 Testi (1%+ Kullanıcı)
İlerleme kaydetmiş kullanıcı için:

```sql
-- Quiz sonucu
INSERT INTO user_quiz_results (user_id, quiz_data, recommended_roadmap)
VALUES (
  'your-user-id-here',
  '{"questions": [], "answers": []}',
  'ux'
);

-- Takip edilen roadmap
INSERT INTO user_roadmaps (user_id, roadmap_slug, is_primary)
VALUES (
  'your-user-id-here',
  'ux',
  true
);

-- İlk adımda %30 ilerleme
INSERT INTO user_progress (user_id, roadmap_slug, step_id, step_title, progress_percentage, completed)
VALUES (
  'your-user-id-here',
  'ux',
  'ux-step-1',
  'UX Nedir?',
  30,
  false
);

-- 3 günlük streak
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
VALUES (
  'your-user-id-here',
  3,
  3,
  CURRENT_DATE
);
```

## 6. Dashboard Segment Mantığı

Dashboard iki farklı segment gösterir:

### Segment 1: 0% Kullanıcı
- **Koşul**: `user_progress` tablosunda hiç kayıt yok
- **Görünüm**: "Hoş geldin" ekranı, önerilen roadmap, "Hadi başla" CTA
- **Amaç**: Kullanıcıyı ilk adımı başlatmaya teşvik etmek

### Segment 2: 1%+ Kullanıcı
- **Koşul**: `user_progress` tablosunda en az 1 kayıt var (%1 bile olsa)
- **Görünüm**: Streak, kaldığın yer, sıradaki adım, mini pratik
- **Amaç**: İlerlemeyi göstermek ve devam ettirmek

## 7. Çoklu Roadmap Desteği

Kullanıcılar birden fazla roadmap'i aynı anda takip edebilir:

```sql
-- İkinci bir roadmap eklemek için:
INSERT INTO user_roadmaps (user_id, roadmap_slug, is_primary)
VALUES (
  'your-user-id-here',
  'ui',
  false  -- Primary değil
);

-- UI roadmap için progress eklemek:
INSERT INTO user_progress (user_id, roadmap_slug, step_id, step_title, progress_percentage, completed)
VALUES (
  'your-user-id-here',
  'ui',
  'ui-step-1',
  'UI Temelleri',
  0,
  false
);
```

## 8. Sidebar Her Zaman Görünür

Her iki segmentte de sidebar görünür kalır:
- ✅ Segment 1 (0%): Sidebar var
- ✅ Segment 2 (1%+): Sidebar var

## 9. Roadmap Slug'ları

Sistemde şu roadmap'ler kullanılabilir:
- `ux` - UX Designer
- `ui` - UI Designer
- `product` - Product Designer

## 10. RLS (Row Level Security)

Tüm tablolar RLS ile korunur. Kullanıcılar sadece kendi verilerini görebilir ve değiştirebilir:
- ✅ Her tablo için `auth.uid() = user_id` kontrolü
- ✅ Select, Insert, Update, Delete policy'leri tanımlı

## Sorun Giderme

### Problem: Dashboard 0% gösteriyor ama ilerleme var
**Çözüm**: `user_progress` tablosunda veri olduğundan emin olun. Console'da kontrol edin.

### Problem: Önerilen roadmap görünmüyor
**Çözüm**: `user_quiz_results` tablosunda `recommended_roadmap` değeri var mı kontrol edin.

### Problem: Streak görünmüyor
**Çözüm**: `user_streaks` tablosunda veri ekleyin. Boş ise otomatik olarak 0 gösterir.

## Geliştirme Notları

- Her roadmap'in 18 adım olduğu varsayılır (totalSteps = 18)
- Progress percentage 0-100 arası olmalı
- Streak günlük olarak güncellenmeli (backend job gerekir)
- Quiz sonuçları register sırasında eklenmeli
