import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  const featureCards = [
    {
      href: '/booking',
      badge: 'Fitur Utama P0',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'Formulir Booking & Live Quotation',
      desc: 'Isi data pemesanan, jadwal pickup, dan daftar barang. Dapatkan estimasi biaya secara otomatis dan persetujuan harga sebelum booking dikirim.',
      icon: 'edit_calendar',
      actionText: 'Buka Form Booking',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      href: '/kalkulator',
      badge: 'Transparansi Tarif',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      title: 'Simulasi & Kalkulator Harga',
      desc: 'Simulasikan tarif resmi Kategori A (mulai Rp 199.000) dan Kategori B (mulai Rp 299.000) berdasarkan pilihan durasi 1 hingga 3 bulan.',
      icon: 'calculate',
      actionText: 'Hitung Simulasi Harga',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    {
      href: '/keamanan',
      badge: 'Standar Mutu 4 Pilar',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'SOP Keamanan & Gudang',
      desc: 'Pelajari perlindungan barang Anda: segel barcode unik anti-rusak, dokumentasi video 360°, gudang CCTV 24 jam, dan garansi kompensasi.',
      icon: 'verified_user',
      actionText: 'Lihat Standar Keamanan',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      href: '/faq',
      badge: 'Panduan Mahasiswa',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Tanya Jawab & Bantuan (FAQ)',
      desc: 'Pertanyaan umum mengenai ketentuan barang, syarat titip motor, daftar barang terlarang, hingga proses pengantaran kembali ke kamar kos.',
      icon: 'help',
      actionText: 'Baca Pertanyaan Umum',
      btnColor: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                           */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-20 overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span>SafeTitip Express & Care • Solusi Mahasiswa Libur Semester</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Titip Barang Kos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-blue-600">Lebih Aman</span>, Bebas Rugi Kos Kosong.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Layanan penjemputan barang langsung ke kamar kos, pengecekan kondisi foto 360°, disimpan di gudang ber-AC & CCTV, serta terjamin garansi resmi.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-600/25 active:translate-y-0.5 transition-all"
                >
                  <span>Mulai Booking Penitipan</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
                <Link
                  href="/kalkulator"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-300 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] text-blue-600">calculate</span>
                  <span>Simulasi Harga</span>
                </Link>
              </div>

              {/* Badges Keunggulan */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <p className="font-extrabold text-slate-900 text-sm">100% Jemput</p>
                  <p className="text-[11px] text-slate-500">Langsung ke kamar kos</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <p className="font-extrabold text-slate-900 text-sm">Video 360°</p>
                  <p className="text-[11px] text-slate-500">Dokumentasi kondisi awal</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <p className="font-extrabold text-slate-900 text-sm">Segel Barcode</p>
                  <p className="text-[11px] text-slate-500">Anti-bongkar dan aman</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <p className="font-extrabold text-slate-900 text-sm">Garansi Resmi</p>
                  <p className="text-[11px] text-slate-500">Perlindungan kompensasi</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. DIREKTORI FITUR PER HALAMAN (MODULAR CARDS)                            */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
                Eksplorasi Fitur Mandiri
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Layanan Terstruktur Per Halaman
              </h2>
              <p className="text-slate-600 text-sm">
                Setiap modul aplikasi dapat diakses secara terpisah untuk kenyamanan navigasi dan pengujian sistem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featureCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                        <span className="material-symbols-outlined text-[28px]">{card.icon}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                      {card.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <Link
                    href={card.href}
                    className={`w-full py-3.5 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all ${card.btnColor}`}
                  >
                    <span>{card.actionText}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. ALUR CARA KERJA (4 LANGKAH MUDAH)                                      */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                Alur Operasional
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                4 Langkah Mudah Menitipkan Barang
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                  1
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Isi Formulir Online</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Masukkan identitas kos, daftar barang, durasi sewa, dan konfirmasi rincian estimasi biaya.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                  2
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Kurir Jemput ke Kamar</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tim kami datang sesuai jadwal, menempelkan segel barcode, dan mendokumentasikan kondisi awal.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                  3
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Disimpan di Gudang Aman</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Barang diletakkan di palet kayu terlindung, bebas lembab dan dipantau kamera CCTV 24 jam.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                  4
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">Diantar Kembali ke Kos</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saat libur selesai dan Anda kembali ke kampus, kurir mengantar barang langsung ke kamar Anda.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. BANNER CTA                                                             */}
        {/* ========================================================================= */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Amankan Slot Penjemputan Kamar Kos Anda
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Kapasitas armada harian dibatasi untuk menjaga kehati-hatian penanganan tiap barang mahasiswa.
            </p>
            <div>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Buka Formulir Pemesanan</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}