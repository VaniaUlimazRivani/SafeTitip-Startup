'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  const itemCategories = [
    {
      title: 'Koper & Tas Pakaian',
      subtitle: 'Pakaian, selimut & perlengkapan pribadi',
      icon: 'luggage',
      bgHex: '#B86B35',
      badge: 'Bungkus Pelindung',
      specs: 'Disimpan dalam posisi berdiri & terlindung dari debu',
    },
    {
      title: 'Kardus & Boks Perlengkapan',
      subtitle: 'Buku, dokumen, alat dapur & perkakas',
      icon: 'package_2',
      bgHex: '#E69526',
      badge: 'Label Barcode',
      specs: 'Maks. tumpukan 3 lapis di atas palet kayu pelindung',
    },
    {
      title: 'Elektronik & Gadget',
      subtitle: 'Kulkas mini, monitor PC, TV & printer',
      icon: 'devices',
      bgHex: '#9B5424',
      badge: 'Penanganan Khusus',
      specs: 'Wajib bubble wrap tebal & cek kondisi kelistrikan awal',
    },
    {
      title: 'Sepeda & Kendaraan',
      subtitle: 'Sepeda lipat, sepeda gunung & sepeda motor',
      icon: 'two_wheeler',
      bgHex: '#7E3F18',
      badge: 'Area Indoor Khusus',
      specs: 'Parkir beratap dengan verifikasi STNK & cek fisik rem/ban',
    },
  ];

  const operationalSteps = [
    {
      num: '01',
      title: 'Jadwalkan Penjemputan',
      desc: 'Tentukan tanggal, jam, dan alamat penjemputan di Kota Padang melalui sistem formulir online.',
      icon: 'calendar_clock',
      color: '#B86B35',
    },
    {
      num: '02',
      title: 'Segel Barcode & Foto 360°',
      desc: 'Kurir datang ke lokasi Anda, menempelkan segel bernomor unik, dan mendokumentasikan kondisi awal barang.',
      icon: 'qr_code_scanner',
      color: '#E69526',
    },
    {
      num: '03',
      title: 'Penyimpanan Gudang Ber-CCTV',
      desc: 'Barang ditempatkan rapi di atas palet kayu berjarak dari lantai dengan pantauan kamera pengawas 24 jam.',
      icon: 'warehouse',
      color: '#9B5424',
    },
    {
      num: '04',
      title: 'Pengantaran Kembali ke Alamat',
      desc: 'Saat Anda kembali ke Padang, barang diantar tepat waktu langsung ke pintu rumah atau kamar baru Anda.',
      icon: 'local_shipping',
      color: '#7E3F18',
    },
  ];

  const securityPillars = [
    {
      title: 'Segel Barcode Anti-Tamper',
      desc: 'Setiap barang diberi stiker segel khusus ber-barcode. Jika segel dibuka atau dirusak secara sengaja, tanda tamper akan terlihat jelas.',
      icon: 'lock',
      tag: 'Integritas Fisik',
    },
    {
      title: 'Dokumentasi Kondisi 360°',
      desc: 'Pengecekan fisik dan dokumentasi foto/video dilakukan sebelum barang masuk ke armada untuk menjamin kondisi barang kembali sama persis.',
      icon: 'photo_camera',
      tag: 'Bukti Otentik',
    },
    {
      title: 'Gudang Beralas Palet Kayu',
      desc: 'Seluruh barang diletakkan di atas palet kayu pelindung dengan sirkulasi udara optimal, bebas risiko lembab, dan aman dari rembesan air.',
      icon: 'layers',
      tag: 'Bebas Lembab & Banjir',
    },
    {
      title: 'Pengawasan CCTV & Garansi Resmi',
      desc: 'Gudang dipantau CCTV tanpa jeda selama 24/7 dan didukung standar operasional ganti rugi resmi jika terjadi kendala pada barang titipan.',
      icon: 'videocam',
      tag: 'Perlindungan Penuh',
    },
  ];

  const serviceAreas = [
    'Pauh (Limau Manis & sekitarnya)',
    'Kuranji & Korong Gadang',
    'Padang Barat & Pantai Padang',
    'Padang Timur & Jati',
    'Padang Utara & Air Tawar',
    'Nanggalo & Gunung Pangilun',
    'Lubuk Begalung & Gaung',
    'Lubuk Kilangan & Indarung',
    'Kawasan Kampus UNAND, UNP, UPI, UBH & UIN',
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1B14] font-sans flex flex-col justify-between selection:bg-[#B86B35] selection:text-white">
      <Navbar />

      <main className="flex-1 space-y-20 sm:space-y-28">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: INFORMATIF & ELEGAN                                      */}
        {/* ========================================================================= */}
        <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-white via-[#F6ECE1]/40 to-[#FAF6F0] border-b border-[#E8DDD3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Kolom Kiri: Informasi Utama & Nilai Layanan */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6ECE1] text-[#7E3F18] text-xs font-extrabold border border-[#EBD8C6]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E69526] animate-pulse"></span>
                  <span>Kosinaja Express & Care • Layanan Penitipan Padang</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2A1B14] leading-[1.12]">
                  Titip Barang Kos, Rumah & Kantor{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B86B35] via-[#C97D43] to-[#E69526]">
                    Aman & Bebas Cemas
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#705E54] leading-relaxed max-w-2xl font-normal">
                  Solusi penitipan barang terpercaya untuk mahasiswa libur semester, karyawan pindah tugas, maupun keluarga di Kota Padang. Kurir siap jemput langsung ke depan pintu alamat Anda, barang disegel barcode anti-bongkar, dan disimpan di gudang ber-CCTV 24 jam.
                </p>

                {/* Ajakan Bertindak Utama */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/booking"
                    style={{ backgroundColor: '#B86B35', color: '#ffffff' }}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-[#B86B35]/25 hover:bg-[#9B5424] active:scale-[0.98] transition-all text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                    <span>Pesan Penjemputan Barang</span>
                  </Link>

                  <a
                    href="#cara-kerja"
                    className="inline-flex items-center gap-1.5 px-5 py-4 rounded-2xl font-bold text-sm text-[#705E54] hover:text-[#B86B35] hover:bg-[#F6ECE1] transition-all cursor-pointer"
                  >
                    <span>Pelajari Alur Kerja</span>
                    <span className="material-symbols-outlined text-[18px]">south</span>
                  </a>
                </div>

                {/* Indikator Kepercayaan Singkat */}
                <div className="pt-3 flex flex-wrap items-center gap-6 text-xs font-bold text-[#705E54]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                    <span>Kurir Jemput ke Alamat</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#B86B35] text-[20px]">qr_code_scanner</span>
                    <span>Segel Barcode Fisik</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#E69526] text-[20px]">videocam</span>
                    <span>Gudang CCTV 24 Jam</span>
                  </div>
                </div>

              </div>

              {/* Kolom Kanan: Visual Foto Realistis & Micro-Cards */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-[#1E1510] group">
                  <img
                    src="/images/hero.jpg"
                    alt="Kosinaja Penjemputan Barang di Kota Padang"
                    className="w-full h-[360px] sm:h-[430px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1510]/80 via-transparent to-transparent"></div>

                  {/* Micro-Card 1: Layanan Pintu */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white shadow-lg flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">door_front</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#705E54] uppercase tracking-wider">Penjemputan Alamat</p>
                      <p className="text-xs font-extrabold text-[#2A1B14]">Langsung ke Depan Pintu</p>
                    </div>
                  </div>

                  {/* Micro-Card 2: Garansi Perlindungan */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white shadow-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#705E54] uppercase tracking-wider">Garansi Keamanan</p>
                      <p className="text-xs font-extrabold text-[#2A1B14]">Dokumentasi Foto 360°</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. INFOGRAFIS MASALAH VS SOLUSI: KENAPA PERLU KOSINAJA?                   */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
              <span className="px-3.5 py-1 rounded-full bg-[#F6ECE1] text-[#7E3F18] text-xs font-extrabold uppercase tracking-wider border border-[#EBD8C6]">
                Efisiensi Biaya & Ketenangan Pikiran
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A1B14] tracking-tight">
                Mengapa Menitipkan Barang di Kosinaja?
              </h2>
              <p className="text-sm text-[#705E54] leading-relaxed font-normal">
                Perbandingan nyata antara tetap membayar sewa kamar/kontrakan kosong dengan menitipkan barang saat Anda berada di luar kota.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Sisi Kiri: Risiko Bayar Sewa Kosong */}
            <ScrollReveal direction="left" delay={100} className="h-full">
              <div className="p-8 rounded-3xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Jika Tetap Sewa Kosong</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#2A1B14]">
                    Beban Sewa Penuh & Khawatir Tanpa Pengawasan
                  </h3>
                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#421E0B]">
                    <p className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">cancel</span>
                      <span>Biaya sewa 2–3 bulan tetap berjalan penuh meski kamar sama sekali tidak ditempati.</span>
                    </p>
                    <p className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">cancel</span>
                      <span>Risiko barang berjamur, berdebu, atau lembab karena ventilasi kamar tertutup rapat berbulan-bulan.</span>
                    </p>
                    <p className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">cancel</span>
                      <span>Kekhawatiran keamanan saat kos/rumah ditinggal sepi selama masa libur panjang atau tugas luar kota.</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-rose-200/80 text-xs text-rose-700 font-bold flex items-center justify-between">
                  <span>Rata-rata pengeluaran sewa 3 bulan:</span>
                  <span className="text-sm font-extrabold text-rose-800">Rp 1.800.000 – Rp 3.000.000+</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Sisi Kanan: Keuntungan Kosinaja */}
            <ScrollReveal direction="right" delay={100} className="h-full">
              <div className="p-8 rounded-3xl bg-[#F6ECE1]/80 border border-[#EBD8C6] flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBD8C6] text-[#7E3F18] text-xs font-extrabold">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Dengan Layanan Kosinaja</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#2A1B14]">
                    Hemat Biaya Hingga 70% & Terproteksi Penuh
                  </h3>
                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#421E0B]">
                    <p className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                      <span>Biaya dihitung sesuai volume barang yang dititipkan, jauh lebih hemat dibanding bayar sewa sebulan penuh.</span>
                    </p>
                    <p className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                      <span>Kurir datang langsung menjemput dan mengantar kembali ke alamat Anda, tidak perlu repot angkut sendiri.</span>
                    </p>
                    <p className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                      <span>Barang tersimpan di gudang bersih beralas palet kayu dengan pemantauan kamera CCTV 24 jam.</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EBD8C6] text-xs text-[#7E3F18] font-bold flex items-center justify-between">
                  <span>Estimasi biaya penitipan Kosinaja:</span>
                  <span className="text-sm font-extrabold text-[#B86B35]">Mulai Rp 199.000 / paket</span>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. KATEGORI BARANG YANG DAPAT DITITIPKAN (INFOGRAFIS VISUAL)              */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
              <span className="px-3.5 py-1 rounded-full bg-[#F6ECE1] text-[#7E3F18] text-xs font-extrabold uppercase tracking-wider border border-[#EBD8C6]">
                Panduan Jenis Muatan
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A1B14] tracking-tight">
                Barang Apa Saja yang Dapat Dititipkan?
              </h2>
              <p className="text-sm text-[#705E54] leading-relaxed font-normal">
                Setiap jenis barang memiliki standar penataan dan pengemasan tersendiri agar tetap terjaga dengan aman di gudang.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {itemCategories.map((cat, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 80} className="h-full">
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-5">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div
                        style={{ backgroundColor: cat.bgHex, color: '#ffffff' }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[26px] text-white">{cat.icon}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold border border-slate-200">
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {cat.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed font-semibold">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">SOP Penataan:</span>
                    <span>{cat.specs}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ALUR OPERASIONAL (BAGAIMANA SISTEM BEKERJA LANGKAH 1-2-3-4)            */}
        {/* ========================================================================= */}
        <section id="cara-kerja" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8DDD3] shadow-sm space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2.5">
                <span className="px-3.5 py-1 rounded-full bg-[#F6ECE1] text-[#7E3F18] text-xs font-extrabold uppercase tracking-wider border border-[#EBD8C6]">
                  Alur Praktis & Transparan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B14] tracking-tight">
                  4 Langkah Mudah Menitipkan Barang
                </h2>
                <p className="text-xs sm:text-sm text-[#705E54] leading-relaxed font-normal">
                  Dari pendaftaran hingga barang diantar kembali, seluruh proses terpantau dan terorganisir dengan rapi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {operationalSteps.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-6 rounded-2xl bg-[#FAF6F0] border border-[#E8DDD3] space-y-4 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          style={{ backgroundColor: st.color, color: '#ffffff' }}
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[24px] text-white">{st.icon}</span>
                        </div>
                        <span className="font-mono text-2xl font-extrabold text-[#DCBEA3]">
                          {st.num}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-[#2A1B14] text-base leading-snug">
                        {st.title}
                      </h4>

                      <p className="text-xs text-[#705E54] leading-relaxed font-normal">
                        {st.desc}
                      </p>
                    </div>

                    <div className="pt-2 text-[11px] font-bold text-[#A89688]">
                      Tahap {sIdx + 1} Selesai
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 5. 4 PILAR JAMINAN KEAMANAN (INFOGRAFIS LENGKAP & FOTO GUDANG)            */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Sisi Kiri: Foto Gudang Berpalet & CCTV */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal direction="left">
                <div className="rounded-3xl overflow-hidden border border-[#E8DDD3] shadow-xl bg-[#1E1510] group">
                  <div className="relative h-72 sm:h-96">
                    <img
                      src="/images/warehouse.jpg"
                      alt="Gudang Kosinaja Berpalet Kayu dan CCTV"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1510]/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-extrabold">
                        Standar Pergudangan Modern
                      </span>
                      <p className="font-extrabold text-base sm:text-lg">Ruangan Kering & Sirkulasi Optimal</p>
                      <p className="text-xs text-[#C4B2A3] font-normal">Palet kayu menjaga barang tidak menyentuh lantai langsung.</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Sisi Kanan: 4 Pilar Keamanan */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal direction="right">
                <div className="space-y-2">
                  <span className="px-3.5 py-1 rounded-full bg-[#F6ECE1] text-[#7E3F18] text-xs font-extrabold uppercase tracking-wider border border-[#EBD8C6]">
                    SOP & Proteksi Mutu
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A1B14] tracking-tight">
                    4 Pilar Jaminan Keamanan Barang Anda
                  </h2>
                  <p className="text-sm text-[#705E54] leading-relaxed font-normal">
                    Setiap paket ditangani dengan protokol terstruktur untuk memastikan barang Anda tetap aman dan terdata secara presisi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {securityPillars.map((pil, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-5 rounded-2xl bg-white border border-[#E8DDD3] shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center font-bold">
                          <span className="material-symbols-outlined text-[20px]">{pil.icon}</span>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#F6ECE1] text-[#7E3F18]">
                          {pil.tag}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-[#2A1B14] text-sm">
                        {pil.title}
                      </h4>
                      <p className="text-xs text-[#705E54] leading-relaxed font-normal">
                        {pil.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. AREA JANGKAUAN PENJEMPUTAN KOTA PADANG                                  */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F6ECE1]/60 border border-[#E8DDD3] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#B86B35]">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>Wilayah Operasional</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#2A1B14]">
                    Jangkauan Penjemputan di Seluruh Kota Padang
                  </h3>
                </div>
                <div className="text-xs text-[#705E54] font-semibold">
                  Armada kurir siap meluncur ke seluruh titik lokasi
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {serviceAreas.map((area, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3.5 rounded-xl bg-white border border-[#E8DDD3] flex items-center gap-2.5 text-xs font-bold text-[#421E0B] shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ========================================================================= */}
        {/* 7. BANNER PENUTUP (CLEAN & PERSUASIF)                                     */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ScrollReveal direction="up" delay={100}>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1E1510] via-[#2A1B14] to-[#38261C] p-8 sm:p-14 text-white shadow-2xl border border-[#38261C]">
              <div className="max-w-2xl space-y-4 relative z-10">
                <span className="px-3.5 py-1 rounded-full bg-[#E69526]/20 text-[#E69526] text-xs font-bold border border-[#E69526]/30">
                  Layanan Penitipan Terpercaya
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Siap Menitipkan Barang Anda dengan Nyaman?
                </h2>
                <p className="text-sm text-[#C4B2A3] leading-relaxed font-normal">
                  Daftarkan jadwal penjemputan Anda hari ini. Kurir Kosinaja akan datang langsung ke pintu kamar atau rumah Anda di Padang.
                </p>
                <div className="pt-3">
                  <Link
                    href="/booking"
                    style={{ backgroundColor: '#B86B35', color: '#ffffff' }}
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-extrabold text-sm shadow-lg shadow-black/25 transition-all hover:bg-[#9B5424] active:scale-95 text-white cursor-pointer"
                  >
                    <span>Mulai Pemesanan Penjemputan</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 w-80 h-80 opacity-10 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined text-[320px] text-[#E69526]">inventory_2</span>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </main>

      <Footer />
    </div>
  );
}