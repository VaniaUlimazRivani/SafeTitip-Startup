'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuotationCalculator from '@/app/components/QuotationCalculator';
import './kalkulator-harga.css';

function formatRupiah(num: number): string {
  return `Rp ${num.toLocaleString('id-ID')}`;
}

export default function KalkulatorHargaPage() {
  const router = useRouter();
  const [showGaransiModal, setShowGaransiModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentCalcData, setCurrentCalcData] = useState<{
    durasi: number;
    kardus: number;
    barangBesar: number;
    totalPerBulan: number;
    grandTotal: number;
  }>({
    durasi: 2,
    kardus: 2,
    barangBesar: 1,
    totalPerBulan: 95000,
    grandTotal: 190000,
  });

  const [formData, setFormData] = useState({
    nama: '',
    noWa: '',
    alamat: '',
    tanggalPickup: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const handlePesanSlot = (data: {
    durasi: number;
    kardus: number;
    barangBesar: number;
    totalPerBulan: number;
    grandTotal: number;
  }) => {
    setCurrentCalcData(data);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const itemsToSubmit = [];
      if (currentCalcData.kardus > 0) {
        itemsToSubmit.push({ nama: 'Kardus Standar (50-70L)', jumlah: currentCalcData.kardus });
      }
      if (currentCalcData.barangBesar > 0) {
        itemsToSubmit.push({ nama: 'Barang Besar / Elektronik', jumlah: currentCalcData.barangBesar });
      }
      if (itemsToSubmit.length === 0) {
        itemsToSubmit.push({ nama: 'Barang Campuran', jumlah: 1 });
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          noWa: formData.noWa,
          alamat: formData.alamat,
          lokasiPickup: formData.alamat,
          tanggalPickup: formData.tanggalPickup || new Date().toISOString().split('T')[0],
          durasiBulan: currentCalcData.durasi,
          persona: 'Mahasiswa Kos',
          items: itemsToSubmit,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookingSuccess(data);
      } else {
        alert(data.error || 'Gagal membuat booking. Silakan coba lagi.');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kh-outer-wrapper">
      {/* Title Watermark */}
      <div className="kh-watermark-title">Pricing Validation</div>

      {/* Main Canvas Frame with Blue Border */}
      <div className="kh-canvas-frame">
        {/* Top Navbar */}
        <header className="kh-navbar">
          <Link href="/" className="kh-logo-group">
            <svg
              className="kh-logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="kh-logo-text">SafeTitip</span>
            <span className="kh-badge-express">Express & Care</span>
          </Link>

          <nav className="kh-nav-links">
            <Link href="/" className="kh-nav-link">
              Beranda
            </Link>
            <Link href="/kalkulator-harga" className="kh-nav-link kh-nav-active">
              Kalkulator Harga
            </Link>
            <a href="#keamanan" className="kh-nav-link">
              Keamanan
            </a>
            <a href="#pesan" className="kh-nav-link">
              Pesan
            </a>
          </nav>

          <div className="kh-nav-right">
            <button
              onClick={() => setShowBookingModal(true)}
              className="kh-btn-pesan-slot"
            >
              Pesan Slot
            </button>
            <button
              className="kh-avatar-btn"
              onClick={() => router.push('/admin')}
              title="Admin Login"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="kh-main-content">
          <QuotationCalculator
            initialDurasi={2}
            initialKardus={2}
            initialBarangBesar={1}
            onPesanSlot={handlePesanSlot}
            onLihatGaransi={() => setShowGaransiModal(true)}
          />

          {/* 3 Features Under Dashed Box */}
          <div className="kh-features-row" id="keamanan">
            <div className="kh-feat-col">
              <div className="kh-feat-icon-sq green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="kh-feat-title">100% Custody Safety Guarantee</h4>
                <p className="kh-feat-desc">
                  Perlindungan komprehensif & asuransi penitipan barang anak kos.
                </p>
              </div>
            </div>

            <div className="kh-feat-col">
              <div className="kh-feat-icon-sq blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h4 className="kh-feat-title">Smart Locker OTP Lock</h4>
                <p className="kh-feat-desc">
                  Sistem loker digital anti-bobol dengan enkripsi 6-digit PIN.
                </p>
              </div>
            </div>

            <div className="kh-feat-col">
              <div className="kh-feat-icon-sq green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h4 className="kh-feat-title">Support Mahasiswa 24/7</h4>
                <p className="kh-feat-desc">
                  Layanan bantuan darurat di seluruh area kampus binaan.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="kh-bottom-footer">
          <div className="kh-footer-left">
            © 2024 SafeTitip Express & Care. Solusi Logistik & Penitipan Anak Kos Amanah.
          </div>
          <div className="kh-footer-nav">
            <a href="#privasi">Kebijakan Privasi</a>
            <span>•</span>
            <a href="#syarat">Syarat Layanan</a>
            <span>•</span>
            <a href="#bantuan">Bantuan Kampus</a>
          </div>
        </footer>
      </div>

      {/* Modal: Rincian Garansi */}
      {showGaransiModal && (
        <div className="kh-modal-backdrop" onClick={() => setShowGaransiModal(false)}>
          <div className="kh-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="kh-modal-close" onClick={() => setShowGaransiModal(false)}>
              ✕
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#d1fae5', color: '#047857', padding: 8, borderRadius: 10 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                  Garansi Resmi SafeTitip Care
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                  Perlindungan menyeluruh tanpa biaya tambahan
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, color: '#334155' }}>
              <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#00507a', marginBottom: 4 }}>
                  1. Ganti Rugi Hingga Rp 10.000.000
                </strong>
                Kompensasi penuh jika terjadi kerusakan fisik atau kehilangan barang selama dalam masa penitipan resmi.
              </div>

              <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#00507a', marginBottom: 4 }}>
                  2. Segel Barcode Unik & CCTV 24 Jam
                </strong>
                Setiap kardus diberi label barcode segel khusus anti-tertukar dan gudang diawasi CCTV nonstop.
              </div>

              <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#00507a', marginBottom: 4 }}>
                  3. Pengembalian Tepat Waktu
                </strong>
                Barang diantar kembali langsung ke kos baru atau kos lama Anda sesuai jadwal yang disepakati.
              </div>
            </div>

            <button
              onClick={() => setShowGaransiModal(false)}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '12px',
                background: '#00507a',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Modal: Form Booking Pesan Slot */}
      {showBookingModal && (
        <div className="kh-modal-backdrop" onClick={() => setShowBookingModal(false)}>
          <div className="kh-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="kh-modal-close" onClick={() => setShowBookingModal(false)}>
              ✕
            </button>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  Booking Berhasil Dipesan!
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
                  Kode Booking: <strong style={{ color: '#00507a', background: '#edf4fe', padding: '3px 8px', borderRadius: 4 }}>{bookingSuccess.booking?.kodeBooking}</strong>
                </p>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 13, textAlign: 'left', marginBottom: 16 }}>
                  <div><strong>Total Estimasi:</strong> {formatRupiah(currentCalcData.grandTotal)} ({currentCalcData.durasi} Bulan)</div>
                  <div style={{ marginTop: 4, color: '#64748b' }}>
                    Barang: {currentCalcData.kardus} Kardus, {currentCalcData.barangBesar} Barang Besar
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingSuccess(null);
                  }}
                  style={{ width: '100%', padding: 12, background: '#00507a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                >
                  Selesai
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                  Konfirmasi Pemesanan Slot
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: 12, color: '#64748b' }}>
                  Estimasi: <strong>{formatRupiah(currentCalcData.totalPerBulan)}/bln</strong> • Total: <strong>{formatRupiah(currentCalcData.grandTotal)}</strong> ({currentCalcData.durasi} Bulan)
                </p>

                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Nama Lengkap *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Nomor WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={formData.noWa}
                      onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Alamat Kos / Lokasi Pickup *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Nama kos, nomor kamar, patokan jalan..."
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, resize: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Rencana Tanggal Jemput (Pickup) *
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.tanggalPickup}
                      onChange={(e) => setFormData({ ...formData, tanggalPickup: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      marginTop: 10,
                      width: '100%',
                      padding: '12px',
                      background: '#00507a',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? 'Memproses...' : 'Konfirmasi Pesan Slot'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
