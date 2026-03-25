# Sonraki Oturum İçin Yapılacaklar

## ✅ Tamamlananlar

### ✅ Radar Chart — Koyu Modda Görünmüyor
- CSS variable'lar (`hsl(var(...))`) Tailwind v4 OKLch yüzünden SVG'de çalışmıyordu
- **Çözüm:** Sabit hex renkler kullanıldı — grid: `#6366f1` (indigo), labels: `#a1a1aa` (zinc-400), radar fill: `#818cf8` (indigo-400)
- Artık hem açık hem koyu modda net görünecek

### ✅ Draft Fill — Kategori Yönlendirme + Türkçe
- "retention:", "monetization:" vb. başlık altındaki notlar ilgili kategorilere yönlendiriliyor
- Kullanıcı cümleleri düzeltiliyor (grammar fix, anlam korunarak)
- Gereksiz İngilizce azaltıldı — sektörel terimler hariç Türkçe tercih

### ✅ AI Analiz — Kapsamlı ve Eğitici
- Prompt tamamen yeniden yazıldı — dürüst, eğitici, gerçekçi
- PM'in eksiklerini somut örneklerle gösteriyor
- Her kategori yorumu 3-5 cümle minimum
- `improvements` alanında 5-7 spesifik eksiklik
- Token: 8K → 16K
- Markdown code block stripping eklendi

### ✅ AI Analiz — Bar Chart Renkleri
- Oyun Puanı: `#818cf8` (indigo), Analiz Kalitesi: `#34d399` (emerald)
- Legend eklendi
- Grid/axis renkleri sabit hex ile koyu modda görünür

### ✅ AI Loading Modal
- Draft Fill ve Save & Analyze işlemlerinde adım adım ilerleme gösteren modal eklendi
- Non-dismissable (dışına tıklama / escape ile kapanmaz)
- Elapsed time counter + simüle adım ilerlemesi (3sn aralıkla)

### ✅ Draft Fill — Notes Alanları Zorunlu
- Kural 14 eklendi: `*Notes` alanları (ftueNotes, retentionNotes, monetizationNotes vb.) MUTLAKA 3-4 cümle ile doldurulmalı
- Kullanıcının kategori altındaki notları ilgili notes alanına yönlendirilecek

### ✅ Game Detail — AI Analiz Butonu
- Analiz yoksa "AI Analizi Yap" butonu gösteriliyor
- Tıklanınca loading modal ile AI analiz başlatılıyor
- Analiz sonrası sayfa otomatik güncelleniyor (TanStack Query invalidation)

### ✅ Slider → Buton Grubu (Script Tag Fix)
- `@base-ui/react/slider` kaldırıldı, tıklanabilir puan butonları ile değiştirildi
- 0-10 arası tam sayı butonlar
- Renk kodlu: yeşil (≥7), sarı (≥4), kırmızı (<4)
- Script tag uyarısı giderildi

## 🔲 Kalan İşler (varsa)

- Yeni AI analiz çıktısını test et — eski analizi sil, yeniden AI analiz yaptır
- Gerekirse AI analiz response schema'sını güncelle (yeni alan eklendiyse)
- KPI tab'da tek veri noktasıyla görsel iyileştirme (bar chart yerine gauge vb.)
