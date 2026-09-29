'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface QuotationCalculatorProps {
  initialDurasi?: 1 | 2 | 3;
  initialKardus?: number;
  initialBarangBesar?: number;
  onPesanSlot?: (data: { durasi: number; kardus: number; barangBesar: number; totalPerBulan: number; grandTotal: number }) => void;
  onLihatGaransi?: () => void;
}

const DURASI_OPTIONS = [
  { value: 1, label: '1 Bulan', sublabel: 'Ujian / Magang Pendek' },
  { value: 2, label: '2 Bulan', sublabel: 'Libur Semester Standar' },
  { value: 3, label: '3 Bulan', sublabel: 'Libur Akhir Tahun / KKN' },
] as const;

const ITEM_TYPES = [
  {
    id: 'kardus',
    name: 'Kardus Standar (50–70L)',
    description: 'Baju, buku kuliah, perlengkapan kamar',
    price: 25000,
    unit: 'box / bulan',
  },
  {
    id: 'barangBesar',
    name: 'Barang Besar / Elektronik',
    description: 'Kulkas mini, dispenser, koper 28", kipas',
    price: 45000,
    unit: 'item / bulan',
  },
] as const;

function formatRupiah(num: number): string {
  return `Rp ${num.toLocaleString('id-ID')}`;
}

export default function QuotationCalculator({
  initialDurasi = 2,
  initialKardus = 2,
  initialBarangBesar = 1,
  onPesanSlot,
  onLihatGaransi,
}: QuotationCalculatorProps) {
  const [durasi, setDurasi] = useState<1 | 2 | 3>(initialDurasi);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    kardus: initialKardus,
    barangBesar: initialBarangBesar,
  });

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  };

  const totalKardus = quantities.kardus ?? 0;
  const totalBarangBesar = quantities.barangBesar ?? 0;

  const totalPerBulan = useMemo(() => {
    return totalKardus * 25000 + totalBarangBesar * 45000;
  }, [totalKardus, totalBarangBesar]);

  const grandTotal = totalPerBulan * durasi;
  const kosCostPerMonth = 1500000;
  const totalKosCost = kosCostPerMonth * durasi;
  const potentialSavings = Math.max(0, totalKosCost - grandTotal);

  const summaryParts: string[] = [];
  if (totalKardus > 0) summaryParts.push(`${totalKardus} Kardus`);
  if (totalBarangBesar > 0) summaryParts.push(`${totalBarangBesar} Barang Besar`);
  const summaryText = summaryParts.length > 0 ? summaryParts.join(' + ') : 'Belum memilih barang';

  const handlePesanClick = () => {
    if (onPesanSlot) {
      onPesanSlot({
        durasi,
        kardus: totalKardus,
        barangBesar: totalBarangBesar,
        totalPerBulan,
        grandTotal,
      });
    }
  };

  return (
    <div className="kh-dashed-box">
      {/* Header Section */}
      <div className="kh-hero-center">
        <div className="kh-badge-transparan">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="10" y2="14" />
            <line x1="14" y1="14" x2="16" y2="14" />
            <line x1="8" y1="18" x2="10" y2="18" />
            <line x1="14" y1="18" x2="16" y2="18" />
          </svg>
          SIMULASI BIAYA TRANSPARAN
        </div>
        <h1 className="kh-hero-h1">
          Hitung Estimasi Tanpa Biaya
          <br />
          Tersembunyi
        </h1>
        <p className="kh-hero-sub">
          Disesuaikan dengan barang khas anak kos: kardus buku & perabotan elektronik.
        </p>
      </div>

      {/* 2 Columns Grid */}
      <div className="kh-grid-columns">
        {/* Left Column: Configuration */}
        <div className="kh-card-left">
          <div className="kh-card-header">
            <h2 className="kh-card-title">
              <span className="kh-dot" />
              Pilih Kebutuhan Simpan
            </h2>
            <span className="kh-badge-flat">Biaya Flat • Bebas Ribet</span>
          </div>

          <div className="kh-duration-title">
            Durasi Penitipan (Periode Libur)
          </div>
          <div className="kh-duration-options">
            {DURASI_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`kh-dur-btn ${durasi === opt.value ? 'active' : ''}`}
                onClick={() => setDurasi(opt.value)}
              >
                <span className="kh-dur-name">{opt.label}</span>
                <span className="kh-dur-sub">{opt.sublabel}</span>
              </button>
            ))}
          </div>

          <div className="kh-items-list">
            {ITEM_TYPES.map((item) => (
              <div key={item.id} className="kh-item-box">
                <div className="kh-item-left">
                  <div className="kh-icon-square">
                    {item.id === 'kardus' ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        <path d="m3.3 7 8.7 5 8.7-5" />
                        <path d="M12 22V12" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="4" y1="10" x2="20" y2="10" />
                        <line x1="8" y1="6" x2="8.01" y2="6" />
                        <line x1="8" y1="14" x2="8.01" y2="14" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="kh-item-name-bold">{item.name}</p>
                    <p className="kh-item-sub-desc">{item.description}</p>
                    <p className="kh-item-price-blue">
                      {formatRupiah(item.price)} <span>/ {item.unit}</span>
                    </p>
                  </div>
                </div>

                <div className="kh-stepper">
                  <button
                    type="button"
                    className="kh-step-btn"
                    onClick={() => updateQty(item.id, -1)}
                    disabled={(quantities[item.id] ?? 0) <= 0}
                    aria-label={`Kurang ${item.name}`}
                  >
                    −
                  </button>
                  <span className="kh-step-count">{quantities[item.id] ?? 0}</span>
                  <button
                    type="button"
                    className="kh-step-btn kh-step-plus"
                    onClick={() => updateQty(item.id, 1)}
                    aria-label={`Tambah ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="kh-facilities-box">
            <div className="kh-facilities-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Fasilitas Standar Sudah Termasuk:
            </div>
            <div className="kh-facilities-items">
              <span className="kh-fac-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="m5 12 5 5L20 7" />
                </svg>
                Kardus packing tebal
              </span>
              <span className="kh-fac-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="m5 12 5 5L20 7" />
                </svg>
                Bubble wrap pelindung
              </span>
              <span className="kh-fac-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="m5 12 5 5L20 7" />
                </svg>
                Barcode anti-tertukar
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Quotation Summary Card */}
        <div className="kh-card-right">
          <div className="kh-right-top-bar">
            <span className="kh-badge-hemat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              HEMAT 45% DARI KOS
            </span>
            <span className="kh-garansi-resmi">Garansi Resmi</span>
          </div>

          <div className="kh-summary-list">
            <div className="kh-sum-row">
              <span className="kh-sum-row-item">{summaryText}</span>
              <span className="kh-sum-row-price">{formatRupiah(totalPerBulan)} / bln</span>
            </div>

            <div className="kh-sum-row">
              <span className="kh-sum-icon-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                Jemput Kamar + Bubblewrap
              </span>
              <span className="kh-tag-gratis">GRATIS</span>
            </div>

            <div className="kh-sum-row">
              <span className="kh-sum-icon-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Asuransi SafeTitip Care
              </span>
              <span className="kh-tag-termasuk">TERMASUK</span>
            </div>

            <div className="kh-sum-row">
              <span className="kh-sum-durasi-label">Durasi Terpilih</span>
              <span className="kh-sum-durasi-val">{durasi} Bulan</span>
            </div>
          </div>

          {/* Total Display Box */}
          <div className="kh-total-display-box">
            <div className="kh-total-sub-label">TOTAL ESTIMASI SIMPAN</div>
            <div className="kh-total-main-price">
              {formatRupiah(totalPerBulan)} <span>/ Bulan</span>
            </div>
            <div className="kh-total-pill-tag">
              Total {durasi} Bulan: {formatRupiah(grandTotal)}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="kh-btn-pesan-action"
            onClick={handlePesanClick}
          >
            Pesan Slot Estimasi Ini →
          </button>

          {/* Garansi Button */}
          <button
            type="button"
            className="kh-btn-garansi-link"
            onClick={onLihatGaransi}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Lihat Rincian Garansi
          </button>
        </div>
      </div>

      {/* Banner: Smart Financial Move */}
      <div className="kh-promo-banner-card">
        <div className="kh-banner-left">
          <div className="kh-banner-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          </div>
          <div>
            <div className="kh-banner-badge-title">
              <span>✦</span> SMART FINANCIAL MOVE MAHASISWA
            </div>
            <h3 className="kh-banner-heading">
              Bayar Kos Kosong Rata–rata Rp 1.500.000/bln vs Titip Barang Cuma {formatRupiah(totalPerBulan)}/bln
            </h3>
            <p className="kh-banner-desc">
              Jangan buang uang kos saat libur panjang semester atau dinas KKN luar kota.
            </p>
          </div>
        </div>

        <div className="kh-banner-right-card">
          <div className="kh-banner-right-top">POTENSI UANG SAKU HEMAT</div>
          <div className="kh-banner-right-amount">
            Hemat {formatRupiah(potentialSavings)}
          </div>
          <div className="kh-banner-right-sub">
            selama {durasi} bulan liburan
          </div>
        </div>
      </div>
    </div>
  );
}
