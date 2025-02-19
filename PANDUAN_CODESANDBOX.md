# Panduan Import Proyek ke CodeSandbox

## Langkah-langkah Upload:

1. Kumpulkan semua file berikut dalam satu folder:
   ```
   /src
   ├── components/
   │   ├── TradingChart.js
   │   ├── TradingForm.js
   │   ├── StrategySelector.js
   │   └── TradingHistory.js
   ├── services/
   │   ├── DerivAPIService.js
   │   └── TradingStrategies.js
   ├── store/
   │   └── TradingContext.js
   ├── App.js
   ├── theme.js
   └── index.js
   /public
   ├── index.html
   └── manifest.json
   package.json
   sandbox.config.json
   .gitignore
   README.md
   ```

2. Buka https://codesandbox.io/
3. Klik tombol "Create" di pojok kanan atas
4. Pilih "Import Project"
5. Anda bisa memilih salah satu dari dua cara:
   - Drag and drop folder proyek yang sudah di-zip
   - Klik "Upload Files" dan pilih file zip proyek

## Setelah Import:

1. CodeSandbox akan otomatis:
   - Mengekstrak file
   - Menginstal dependencies
   - Menjalankan proyek

2. Setelah berhasil:
   - Anda akan mendapatkan URL unik untuk proyek (contoh: https://xxxxx.csb.app)
   - Gunakan URL ini untuk mendaftarkan aplikasi di Deriv API
   - Update `DerivAPIService.js` dengan URL CodeSandbox yang baru

## Troubleshooting:

Jika mengalami masalah:
1. Pastikan semua file termasuk dalam zip
2. Periksa package.json memiliki semua dependencies yang diperlukan
3. Periksa sandbox.config.json sudah benar
4. Jika ada error, lihat console browser untuk detail

## Tips:
- Simpan URL CodeSandbox Anda
- Proyek bisa di-edit langsung di CodeSandbox
- Perubahan akan otomatis tersimpan
- Anda bisa share URL dengan orang lain untuk kolaborasi
