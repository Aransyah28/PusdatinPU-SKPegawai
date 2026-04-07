# Report Year Selection System

## Overview
Sistem year selection untuk 4 halaman laporan (Bulanan, Kinerja, Mingguan, Triwulan) yang memungkinkan user memilih tahun terlebih dahulu sebelum melihat file laporan.

## Struktur Routing

```
/laporanbulanan          → Tampil YearSelector
├── /laporanbulanan/2024 → Detail laporan tahun 2024
├── /laporanbulanan/2025 → Detail laporan tahun 2025
└── /laporanbulanan/2026 → Detail laporan tahun 2026

/laporankinerja          → Tampil YearSelector
├── /laporankinerja/2024
├── /laporankinerja/2025
└── /laporankinerja/2026

/laporanmingguan         → Tampil YearSelector
├── /laporanmingguan/2024
└── ...

/laporantriwulan         → Tampil YearSelector
├── /laporantriwulan/2024
└── ...
```

## Komponen

### YearSelector (`src/components/reports/YearSelector.tsx`)
- Menampilkan grid tahun yang memiliki file
- Menampilkan jumlah file per tahun
- Desain mengikuti tema dengan hover effect dan gradient
- Loading skeleton saat fetch data
- Empty state jika tidak ada data

**Props:**
- `reportType: string` - Tipe laporan (bulanan, kinerja, mingguan, triwulan)
- `baseUrl: string` - URL base untuk link (misal: `/laporanbulanan`)

### Hook (`src/hooks/use-available-years.ts`)
- `useAvailableYears(reportType)` - Fetch tahun yang tersedia
- Return: `{ year: number, count: number }[]`

## API

### Endpoint: `/api/reports/[reportType]/years`
- **Method:** GET
- **Params:** 
  - `reportType` - bulanan, kinerja, mingguan, triwulan
- **Response:**
  ```json
  [
    { "year": 2026, "count": 12 },
    { "year": 2025, "count": 24 }
  ]
  ```

## Navbar Title Update
Navbar sekarang menampilkan title dinamis berdasarkan halaman:
- `/laporankinerja` → "Laporan Kinerja"
- `/laporankinerja/2026` → "Laporan Kinerja 2026"

## Design Notes
- Grid responsive: 2 kolom mobile, 3 kolom tablet, 4 kolom desktop
- Setiap card memiliki:
  - Tahun dengan text-title-lg font-bold text-primary
  - Count file dengan text-label-md text-body/60
  - Hover effect dengan gradient dan shadow
- Empty state border dashed muted

## TODO
- Implementasi DocumentsSection di halaman detail tahun
- Tambahkan filter description berdasarkan reportType untuk fetch file yang sesuai
