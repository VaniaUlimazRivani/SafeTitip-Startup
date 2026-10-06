'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  const featureCards = [
    {
      href: '/booking',
      badge: 'Layanan Utama P0',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'Formulir Booking & Live Quotation',
      desc: 'Pesan jadwal penjemputan barang langsung ke kamar kos Anda di Padang. Estimasi biaya dihitung otomatis saat Anda memasukkan rincian barang.',
      icon: 'edit_calendar',
      bgHex: '#2563eb', // Blue-600
      hoverHex: '#1d4ed8',
      actionText: 'Buka Form Booking',
      perks: ['Jemput langsung ke kamar kos', 'Hitung estimasi tarif otomatis', 'Persetujuan harga di awal'],
    },
    {
      href: '/kalkulator',
      badge: 'Transparansi Biaya',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: 'Simulasi & Kalkulator Tarif Resmi',
      desc: 'Ketahui estimasi pengeluaran secara transparan tanpa biaya tersembunyi. Simulasi paket Kategori A, B, atau barang khusus untuk durasi 1–3 bulan.',
      icon: 'calculate',
      bgHex: '#4f46e5', // Indigo-600
      hoverHex: '#4338ca',
      actionText: 'Hitung Simulasi Harga',
      perks: ['Tarif flat mulai Rp 199.000', 'Pilihan durasi 1, 2, atau 3 bulan', 'Bebas biaya antar-jemput'],
    },
    {
      href: '/keamanan',
      badge: 'Standar Mutu 4 Pilar',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'SOP Keamanan & Gudang Terpadu',
      desc: 'Pelajari jaminan keamanan barang titipan Anda melalui 4 pilar operasional: segel unik ber-barcode, foto dokumentasi 360°, dan gudang ber-CCTV 24 jam.',
      icon: 'verified_user',
      bgHex: '#059669', // Emerald-600
      hoverHex: '#047857',
      actionText: 'Lihat Standar Keamanan',
      perks: ['Segel barcode anti-tamper', 'Foto dokumentasi fisik 360°', 'Garansi kompensasi resmi'],
    },
    {
      href: '/faq',
      badge: 'Pusat Bantuan',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      title: 'Tanya Jawab & Panduan Titip (FAQ)',
      desc: 'Jawaban lengkap seputar regulasi penitipan barang, barang apa saja yang diperbolehkan dan dilarang keras, hingga jadwal pengantaran saat Anda kembali.',
      icon: 'help',
      bgHex: '#0f172a', // Slate-900
      hoverHex: '#1e293b',
      actionText: 'Buka Panduan & FAQ',
      perks: ['Daftar barang boleh & dilarang', 'Syarat titip motor + STNK', 'Kontak responsif WhatsApp'],
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Isi Form Booking',
      desc: 'Pilih jadwal jemput, area kampus Padang, dan daftar barang. Sistem menghitung estimasi instan.',
      icon: 'edit_calendar',
      bgHex: '#3b82f6',
    },
    {
      step: '02',
      title: 'Kurir Jemput Kamar',
      desc: 'Kurir tiba di kamar kos Anda, menempelkan segel barcode unik, dan foto dokumentasi 360°.',
      icon: 'local_shipping',
      bgHex: '#10b981',
    },
    {
      step: '03',
      title: 'Disimpan di Gudang',
      desc: 'Barang ditempatkan di atas palet kayu, ruangan sirkulasi optimal, dan terpantau CCTV 24 jam.',
      icon: 'warehouse',
      bgHex: '#6366f1',
    },
    {
      step: '04',
      title: 'Diantar Pas Balik',
      desc: 'Saat liburan semester usai dan Anda kembali ke Padang, barang diantar kembali ke pintu kos Anda.',
      icon: 'home_pin',
      bgHex: '#d97706',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 space-y-16 sm:space-y-24">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION DUA KOLOM PRESISI & VISUAL SEIMBANG                       */}
        {/* ========================================================================= */}
        <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Kolom Kiri: Teks & Aksi */}
              <div className="lg:col-span-6 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold border border-blue-200 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                  <span>SafeTitip Express & Care • Solusi Libur Semester Padang</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
                  Titip Barang Kos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-emerald-600">Lebih Aman</span>, Bebas Rugi Kos Kosong.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Kurir menjemput langsung dari kamar kos Anda di Padang. Disimpan rapi di gudang berpalet kayu, dipantau CCTV 24 jam, dan bergaransi kompensasi resmi.
                </p>

                {/* Tombol Aksi */}
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <Link
                    href="/booking"
                    style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                    <span>Mulai Booking Penitipan</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>

                  <Link
                    href="/kalkulator"
                    style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-sm sm:text-base border border-slate-300 shadow-xs hover:bg-slate-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px] text-blue-600">calculate</span>
                    <span>Simulasi Harga</span>
                  </Link>
                </div>

                {/* Jangkauan Kampus Kota Padang */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-600">
                  <span className="text-slate-400">Area Kampus:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UNAND</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UNP</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UPI YPTK</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UBH</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UIN IB</span>
                </div>

                {/* Rating & Bukti Sosial */}
                <div className="pt-1 flex items-center gap-4 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-1 text-amber-500">
                    <span>★ ★ ★ ★ ★</span>
                    <span className="text-slate-900 font-extrabold ml-1">4.9/5</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <div className="flex items-center gap-1 text-emerald-700">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                    <span>100% Jemput ke Kamar Kos</span>
                  </div>
                </div>

              </div>

              {/* Kolom Kanan: Visual Card Presisi dengan Foto & Floating Badges */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-slate-900 group">
                  <img
                    src="/images/hero.jpg"
                    alt="SafeTitip Penjemputan Kamar Kos Mahasiswa"
                    className="w-full h-[340px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent"></div>

                  {/* Floating Badge 1: Layanan Kamar Kos */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white shadow-lg flex items-center gap-2.5 animate-float-slow">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">door_front</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Layanan Kamar</p>
                      <p className="text-xs font-extrabold text-slate-900">Jemput ke Pintu Kosan</p>
                    </div>
                  </div>

                  {/* Floating Badge 2: Tarif Mulai Rp 199.000 */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white shadow-xl flex items-center gap-3 animate-float-reverse">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
                      <span className="material-symbols-outlined text-[20px]">savings</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tarif Mahasiswa</p>
                      <p className="text-xs font-extrabold text-blue-700">Mulai Rp 199.000 / bln</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 4 Badges Keunggulan Seimbang & Rata Presisi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 mt-10 border-t border-slate-200/80">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">100% Jemput</p>
                  <p className="text-[11px] text-slate-500 truncate">Langsung ke kamar kos</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">Video 360°</p>
                  <p className="text-[11px] text-slate-500 truncate">Dokumentasi awal barang</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">Segel Barcode</p>
                  <p className="text-[11px] text-slate-500 truncate">Anti-bongkar unik</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">Garansi Resmi</p>
                  <p className="text-[11px] text-slate-500 truncate">Perlindungan kompensasi</p>
                </div>
              </div>
            </div>

            {/* Indicator Scroll Down Beranimasi */}
            <div className="pt-10 flex flex-col items-center justify-center text-center">
              <a
                href="#layanan-fitur"
                className="group inline-flex flex-col items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                <span>Scroll ke bawah untuk eksplorasi</span>
                <div className="w-8 h-8 rounded-full border border-slate-300 group-hover:border-blue-500 flex items-center justify-center bg-white shadow-2xs animate-bounce">
                  <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-blue-600">
                    keyboard_arrow_down
                  </span>
                </div>
              </a>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. DIREKTORI FITUR (DENGAN ANIMASI SCROLL REVEAL & TOMBOL BERWARNA TEGAS) */}
        {/* ========================================================================= */}
        <section id="layanan-fitur" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                Eksplorasi Fitur Mandiri
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Layanan Terstruktur Per Halaman
              </h2>
              <p className="text-slate-600 text-sm">
                Setiap modul aplikasi dapat diakses secara terpisah untuk kenyamanan navigasi dan pengujian sistem.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {featureCards.map((card, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 120} className="h-full">
                <div className="p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all h-full flex flex-col justify-between group">
                  <div className="space-y-4">
                    {/* Top Header Kartu */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                      {/* Icon Container dengan Background Warna Solid & Terjamin Muncul */}
                      <div
                        style={{ backgroundColor: card.bgHex, color: '#ffffff' }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                      >
                        <span className="material-symbols-outlined text-[26px] text-white">{card.icon}</span>
                      </div>
                    </div>

                    {/* Judul & Deskripsi */}
                    <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                      {card.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>

                    {/* Bullet Poin Keunggulan (Visual Checkmarks) */}
                    <div className="pt-2 space-y-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                      {card.perks.map((p, pIdx) => (
                        <p key={pIdx} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                          <span>{p}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Tombol Aksi Bawah: Warna Solid Terang, Tidak Transparan, Kontras Jelas */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      href={card.href}
                      style={{ backgroundColor: card.bgHex, color: '#ffffff' }}
                      className="w-full py-3.5 px-4 rounded-xl text-center text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all hover:brightness-110 hover:shadow-lg active:scale-[0.98] text-white"
                    >
                      <span className="text-white font-extrabold">{card.actionText}</span>
                      <span className="material-symbols-outlined text-[18px] text-white">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SHOWCASE FOTO REAL: KURIR & GUDANG DENGAN ANIMASI SCROLL SLIDE         */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Foto Kurir Padang (Slide dari Kiri saat Scroll) */}
            <ScrollReveal direction="left" delay={100}>
              <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-full">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src="/images/courier.jpg"
                    alt="Kurir SafeTitip Penjemputan Kamar Kos"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-extrabold text-blue-700 border border-white shadow-xs">
                    Armada Kota Padang
                  </div>
                </div>
                <div className="p-6 space-y-2.5">
                  <h3 className="font-extrabold text-lg text-slate-900">Kurir Langsung ke Kamar Kos Anda</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tidak perlu repot mengangkut barang ke tempat ekspedisi. Kurir kami menjemput tepat waktu di seluruh kos sekitar kampus Padang.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/booking"
                      style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm hover:brightness-110 transition-all text-white"
                    >
                      <span>Pesan Jadwal Jemput</span>
                      <span className="material-symbols-outlined text-[16px] text-white">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Foto Gudang Ber-CCTV (Slide dari Kanan saat Scroll) */}
            <ScrollReveal direction="right" delay={100}>
              <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-full">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src="/images/warehouse.jpg"
                    alt="Gudang Penyimpanan Barang SafeTitip"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-extrabold text-emerald-700 border border-white shadow-xs">
                    CCTV 24 Jam Aktif
                  </div>
                </div>
                <div className="p-6 space-y-2.5">
                  <h3 className="font-extrabold text-lg text-slate-900">Gudang Bersih, Beralas Palet Kayu</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Semua barang diletakkan di atas palet kayu pelindung bebas banjir, terhindar dari lembab, dan dipantau kamera pengawas 24 jam penuh.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/keamanan"
                      style={{ backgroundColor: '#059669', color: '#ffffff' }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm hover:brightness-110 transition-all text-white"
                    >
                      <span>Pelajari Standar Gudang</span>
                      <span className="material-symbols-outlined text-[16px] text-white">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ALUR CARA KERJA (4 LANGKAH DENGAN ANIMASI SCROLL STAGGERED)            */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                  Alur Operasional Sederhana
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  4 Langkah Mudah Menitipkan Barang Kos
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {steps.map((st, sIdx) => (
                  <ScrollReveal key={sIdx} direction="up" delay={sIdx * 100} className="h-full">
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 relative group hover:bg-blue-50/50 hover:border-blue-200 transition-all flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div
                            style={{ backgroundColor: st.bgHex, color: '#ffffff' }}
                            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[24px] text-white">{st.icon}</span>
                          </div>
                          <span className="font-mono text-xl font-extrabold text-slate-300 group-hover:text-blue-600 transition-colors">
                            {st.step}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-slate-900 text-base">
                          {st.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>

                      <div className="pt-2 text-[11px] font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Langkah {sIdx + 1}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 5. BANNER CTA ELEGAN DENGAN SCROLL REVEAL                                 */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ScrollReveal direction="up" delay={150}>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-14 text-white shadow-2xl border border-slate-800">
              <div className="max-w-2xl space-y-5 relative z-10">
                <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                  Slot Terbatas Khusus Periode Mudik
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Amankan Slot Penjemputan Kamar Kos Anda
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Kapasitas armada harian kami batasi agar setiap barang mahasiswa diperiksa teliti dan terdokumentasi dengan rapi.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/booking"
                    style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                    className="px-7 py-3.5 rounded-xl font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 hover:brightness-110 active:scale-95 text-white"
                  >
                    <span className="text-white">Buka Formulir Pemesanan</span>
                    <span className="material-symbols-outlined text-[18px] text-white">arrow_forward</span>
                  </Link>
                  <Link
                    href="/faq"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
                    className="px-6 py-3.5 rounded-xl font-bold text-sm border border-white/20 hover:bg-white/20 transition-all text-white"
                  >
                    Lihat FAQ
                  </Link>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 w-80 h-80 opacity-15 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined text-[320px] text-blue-400">inventory_2</span>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </main>

      <Footer />
    </div>
  );
}