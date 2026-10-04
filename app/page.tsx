import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 space-y-16 sm:space-y-24">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION VISUAL-FIRST DENGAN GAMBAR & ANIMASI FLOATING            */}
        {/* ========================================================================= */}
        <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-white via-blue-50/50 to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Visual Headline & Instant Actions */}
              <div className="lg:col-span-6 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 text-blue-800 text-xs font-extrabold border border-blue-200 shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Solusi Mudik Mahasiswa Kota Padang</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Titip Barang Kos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-500 to-emerald-600">Aman & Praktis</span> Tanpa Rugi Bayar Kos Kosong.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                  Kurir jemput langsung ke kamar kos Anda di Padang. Disimpan rapi di gudang ber-AC & CCTV, bergaransi resmi mulai Rp 199.000.
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-1">
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                    <span>Booking Penjemputan</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>

                  <Link
                    href="/kalkulator"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px] text-blue-600">calculate</span>
                    <span>Cek Harga</span>
                  </Link>
                </div>

                {/* Campus Coverage Pills */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-600">
                  <span className="text-slate-400">Area Kampus:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UNAND</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UNP</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UPI YPTK</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UBH</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">UIN IB</span>
                </div>

                {/* Micro Badges / Social Proof */}
                <div className="pt-2 flex items-center gap-4 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <span>★ ★ ★ ★ ★</span>
                    <span className="text-slate-900 font-extrabold">4.9/5</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <div className="flex items-center gap-1 text-slate-700">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                    <span>100% Jemput Kamar Kos</span>
                  </div>
                </div>

              </div>

              {/* Right Column: High Quality Visual Showcase with Floating Cards */}
              <div className="lg:col-span-6 relative">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-sky-400/20 to-emerald-400/20 rounded-3xl blur-2xl opacity-70"></div>

                <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-white group">
                  <img
                    src="/images/hero.jpg"
                    alt="SafeTitip Penjemputan Kamar Kos Mahasiswa"
                    className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                  {/* Floating Card 1: Status Jemput Kamar */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white shadow-lg flex items-center gap-2.5 animate-float-slow">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">door_front</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Layanan Kamar</p>
                      <p className="text-xs font-extrabold text-slate-900">Jemput ke Kosan</p>
                    </div>
                  </div>

                  {/* Floating Card 2: Harga Mulai */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white shadow-xl flex items-center gap-3 animate-float-reverse">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
                      <span className="material-symbols-outlined text-[22px]">savings</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tarif Flat Mahasiswa</p>
                      <p className="text-sm font-extrabold text-blue-700">Mulai Rp 199.000 / bln</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SHOWCASE VISUAL 3 PILAR UTAMA (GAMBAR NYATA & LEBIH SEDIKIT TEKS)     */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
              Solusi Terpercaya
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Kenapa Mahasiswa Memilih SafeTitip?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Armada Kurir */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/images/courier.jpg"
                  alt="Kurir SafeTitip Penjemputan Kamar Kos"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-blue-700 border border-white">
                  Pickup Langsung
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-extrabold text-xl text-slate-900">Kurir Ramah & Tepat Waktu</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tidak perlu repot angkut barang berat. Kurir kami menjemput langsung dari kamar kos Anda di seluruh penjuru Kota Padang.
                </p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-800 pt-1"
                >
                  <span>Pesan Jadwal Jemput</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Card 2: Gudang Aman */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/images/warehouse.jpg"
                  alt="Gudang Penyimpanan Barang SafeTitip"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-emerald-700 border border-white">
                  CCTV 24 Jam
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-extrabold text-xl text-slate-900">Gudang Kering & Bebas Banjir</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Semua barang diletakkan di atas palet kayu ber-AC, diawasi CCTV 24 jam dan dilindungi segel unik anti-bongkar.
                </p>
                <Link
                  href="/keamanan"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:text-emerald-800 pt-1"
                >
                  <span>Cek SOP Keamanan</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Card 3: Live Quotation & Kalkulator */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-700 text-white p-7 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold border border-white/20 backdrop-blur-md inline-block">
                  Transparansi 100%
                </span>
                <h3 className="text-2xl font-extrabold leading-snug">
                  Cek Estimasi Harga Instan
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Ketik nama barang dan durasi waktu titip, sistem langsung menghitung total biaya tanpa ada biaya tersembunyi saat kurir tiba.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Kategori A (Dus Buku/Pakaian)</span>
                  <span className="text-emerald-300 font-extrabold">Rp 199.000</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold border-t border-white/15 pt-2">
                  <span>Kategori B (Kulkas/Elektronik)</span>
                  <span className="text-emerald-300 font-extrabold">Rp 299.000</span>
                </div>
              </div>

              <Link
                href="/kalkulator"
                className="w-full py-3.5 rounded-xl bg-white text-blue-800 font-extrabold text-center text-xs shadow-lg hover:bg-slate-100 transition-colors mt-6 block"
              >
                Buka Kalkulator Simulasi →
              </Link>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. ALUR VISUAL 4 LANGKAH JEMPUT BARANG                                   */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Alur Sangat Mudah</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Cara Kerja SafeTitip dalam 4 Langkah
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-base">
                  <span className="material-symbols-outlined text-[26px]">edit_note</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">1. Isi Form Online</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilih tanggal jemput kos dan rincian barang. Dapatkan persetujuan harga instan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-base">
                  <span className="material-symbols-outlined text-[26px]">local_shipping</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">2. Kurir Jemput Kamar</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kurir datang ke kos, segel barang ber-barcode, dan foto dokumentasi 360°.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-base">
                  <span className="material-symbols-outlined text-[26px]">warehouse</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">3. Disimpan di Gudang</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Barang diletakkan di atas palet aman, bebas banjir dan terpantau CCTV 24 jam.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group hover:bg-blue-50/50 hover:border-blue-200 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-extrabold text-base">
                  <span className="material-symbols-outlined text-[26px]">home_pin</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">4. Diantar Pas Balik</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saat libur selesai dan Anda kembali ke Padang, barang diantar kembali ke kamar.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CALL TO ACTION BANNER ELEGAN                                           */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-14 text-white shadow-2xl border border-slate-800">
            <div className="max-w-2xl space-y-5 relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                Slot Terbatas Khusus Periode Mudik
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Mau Mudik Tenang Tanpa Beban Barang Kos?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Kapasitas armada harian dibatasi untuk menjaga kehati-hatian penanganan tiap barang. Daftarkan jadwal Anda sekarang!
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/booking"
                  className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>Mulai Booking Sekarang</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link
                  href="/faq"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
                >
                  Lihat FAQ
                </Link>
              </div>
            </div>

            <div className="absolute right-0 bottom-0 w-80 h-80 opacity-20 pointer-events-none hidden lg:block">
              <span className="material-symbols-outlined text-[320px] text-blue-400">inventory_2</span>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}