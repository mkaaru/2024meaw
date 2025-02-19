# Panduan Upload ke GitHub dan Import ke CodeSandbox

## Langkah 1: Persiapan Repository GitHub
1. Buka https://github.com
2. Klik tombol "New" untuk membuat repository baru
3. Beri nama repository: "deriv-trading-bot"
4. Pilih "Public" sebagai visibility
5. Klik "Create repository"

## Langkah 2: Upload ke GitHub
Jalankan perintah berikut di terminal:
```bash
# Inisialisasi git repository lokal
git init

# Tambahkan semua file
git add .

# Commit perubahan
git commit -m "Initial commit"

# Tambahkan remote repository
git remote add origin [URL_REPOSITORY_ANDA]

# Push ke GitHub
git push -u origin main
```

## Langkah 3: Import ke CodeSandbox
1. Buka https://codesandbox.io
2. Klik "Create" -> "Import Repository"
3. Paste URL repository GitHub Anda
4. Klik "Import and Fork"

## File yang Akan Di-upload
```
├── src/
│   ├── components/
│   │   ├── TradingChart.js
│   │   ├── TradingForm.js
│   │   ├── StrategySelector.js
│   │   └── TradingHistory.js
│   ├── services/
│   │   ├── DerivAPIService.js
│   │   └── TradingStrategies.js
│   ├── store/
│   │   └── TradingContext.js
│   ├── App.js
│   ├── theme.js
│   └── index.js
├── public/
│   ├── index.html
│   └── manifest.json
├── package.json
├── sandbox.config.json
├── .gitignore
└── README.md
```

## Setelah Import Berhasil
1. CodeSandbox akan otomatis:
   - Menginstal dependencies
   - Menjalankan development server
   - Memberikan URL unik untuk aplikasi Anda

2. Update Deriv API:
   - Gunakan URL CodeSandbox yang baru di Deriv API settings
   - Update redirect URI di `DerivAPIService.js`

## Catatan Penting
- Pastikan repository GitHub bersifat public
- Jangan lupa update App ID dan redirect URI setelah deploy
- Simpan URL CodeSandbox untuk referensi
