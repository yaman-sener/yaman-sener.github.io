# yaman-sener.github.io

Kişisel portfolyo sitesi. Tek sayfa, statik — GitHub Pages üzerinde yayınlanıyor.

## Önemli: CSS artık derleniyor

Site eskiden Tailwind'i CDN'den (`cdn.tailwindcss.com`) çekiyordu; bu, her ziyarette
~120 KB JavaScript indirip CSS'i tarayıcıda üretmek demekti. Artık CSS önceden
derlenip `styles.css` dosyasına yazılıyor (~25 KB, gzip ile ~6 KB).

**Bunun tek pratik sonucu:** `index.html` içine *yeni bir Tailwind sınıfı* eklediğinde
(`md:grid-cols-4`, `text-emerald-500` gibi) CSS'i yeniden derlemen gerekir:

```bash
npm run build
```

Yazı, link, görsel değiştirmek için derlemeye gerek yok — sadece yeni sınıf eklerken.

Uzun süre çalışırken otomatik derleme:

```bash
npm run watch
```

İlk kurulum (bir kez):

```bash
npm install
```

## Dosya düzeni

| Dosya / klasör | Ne işe yarar |
| --- | --- |
| `index.html` | Sitenin tamamı |
| `src/input.css` | Özel CSS kaynağı (kart, rozet, glow stilleri) — burayı düzenle |
| `styles.css` | **Üretilen dosya.** Elle düzenleme, `npm run build` üzerine yazar |
| `tailwind.config.js` | Renk paleti ve fontlar |
| `assets/` | Proje ekran görüntüleri (900 px genişlik, webp) |
| `sw.js` | Service worker — tekrar ziyaretlerde önbellekten hızlı açılış |
| `site.webmanifest` | PWA / ana ekrana ekleme bilgileri |
| `favicon.svg`, `apple-touch-icon.png`, `icon-*.png` | Site ikonları |
| `og-image.jpg` | Link paylaşımlarında görünen 1200×630 önizleme |
| `robots.txt`, `sitemap.xml` | Arama motorları |

## `sw.js` güncellemesi

`index.html` veya `styles.css` değiştiğinde `sw.js` içindeki

```js
const CACHE_VERSION = 'v1';
```

satırını `'v2'`, `'v3'`… diye artır. Aksi halde önbelleğe alınmış eski dosyalar bir
süre daha ziyaretçilere servis edilebilir. (HTML zaten "önce ağ" stratejisiyle
çalışıyor, yani metin değişiklikleri hemen görünür; bu adım CSS ve görseller için.)

## Yeni proje kartı eklemek

`index.html` içinde `<!-- ============ PROJECTS ============ -->` bölümünü bul ve
mevcut bir kartı kopyala. Görseli `assets/` içine 900 px genişliğinde webp olarak koy:

```bash
# örnek: yeni bir ekran görüntüsünü küçültüp webp'e çevirme
npx sharp-cli --input ekran.png --output assets/yeni-proje.webp resize 900
```

Kartın `<img>` etiketinde `width="900" height="427"` ve `loading="lazy"` kalsın —
bunlar sayfanın yüklenirken zıplamasını (layout shift) önlüyor.

## Yerel önizleme

```bash
node serve.js
```

Sonra `http://localhost:4321` adresini aç.
