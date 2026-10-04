import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function KeamananPage() {
  const pilarList = [
    {
      icon: 'qr_code_scanner',
      title: 'Segel Barcode Unik (Security Seal)',
      color: 'bg-blue-100 text-blue-700',
      desc: 'Setiap dus buku, kontainer, dan barang elektronik ditempel segel keamanan ber-barcode unik anti-tamper. Jika segel dibuka paksa, akan meninggalkan jejak void yang terdeteksi sistem.',
    },
    {
      icon: 'videocam',
      title: 'Dokumentasi Video & Foto 360°',
      color: 'bg-emerald-100 text-emerald-700',
      desc: 'Sebelum barang dimasukkan ke armada penjemputan, kurir dan pelanggan mendokumentasikan kondisi fisik barang secara 360 derajat. Foto tersimpan rapi di sistem laporan kondisi.',
    },
    {
      icon: 'warehouse',
      title: 'Gudang Kering, Palet & CCTV 24 Jam',
      color: 'bg-indigo-100 text-indigo-700',
      desc: 'Gudang SafeTitip memiliki sirkulasi udara optimal, lantai bebas banjir dengan palet kayu pelindung, serta diawasi oleh kamera pengawas CCTV selama 24 jam penuh tanpa jeda.',
    },
    {
      icon: 'verified_user',
      title: 'Garansi Kompensasi Penuh Resmi',
      color: 'bg-purple-100 text-purple-700',
      desc: 'Perjanjian penitipan dilindungi oleh klausul kompensasi resmi jika terjadi kerusakan atau kehilangan akibat kelalaian penanganan operasional.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Standar Mutu Layanan
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Standar Keamanan SOP Gudang
          </h1>
          <p className="text-sm text-slate-600">
            Kami menjaga setiap barang berharga Anda dengan standar penanganan logistik terbaik dan pengawasan 24 jam.
          </p>
        </div>

        {/* Visual Hero Showcase: Warehouse Image with Floating Badges */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-slate-900 group">
          <img
            src="/images/warehouse.jpg"
            alt="Gudang Aman SafeTitip Padang"
            className="w-full h-[320px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

          {/* Floating Badge 1: CCTV 24 Jam */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-lg flex items-center gap-2.5 animate-float-slow">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            <p className="text-xs font-extrabold text-slate-900">CCTV 24 Jam Aktif</p>
          </div>

          {/* Floating Badge 2: Palet Kayu & Suhu Kering */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 text-white">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">
                Fasilitas Terverifikasi
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold">Gudang Kering Beralas Palet Kayu</h3>
              <p className="text-xs text-slate-300 max-w-lg">
                Tidak bersentuhan langsung dengan lantai semen untuk mencegah lembab dan jamur pada buku atau pakaian.
              </p>
            </div>
            <Link
              href="/booking"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all"
            >
              Booking Slot Sekarang →
            </Link>
          </div>
        </div>

        {/* 4 Pilar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pilarList.map((p, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all space-y-3"
            >
              <div className={`w-12 h-12 rounded-2xl ${p.color} flex items-center justify-center font-bold`}>
                <span className="material-symbols-outlined text-[28px]">{p.icon}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Kebijakan Penolakan Barang Terlarang */}
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">gavel</span>
            </div>
            <div>
              <h3 className="font-extrabold text-rose-900 text-base">Aturan Keselamatan & Barang Terlarang (BR-A-P0-04)</h3>
              <p className="text-xs text-rose-700">Untuk melindungi seluruh barang pelanggan di gudang bersama:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-rose-950 font-semibold pt-2">
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-[18px]">no_meals</span>
              <span>Makanan / Minuman mudah busuk</span>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-[18px]">payments</span>
              <span>Uang tunai & perhiasan emas</span>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-[18px]">pets</span>
              <span>Hewan hidup & zat berbahaya</span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-extrabold">Barang Kos Anda Terjamin 100% Aman</h3>
            <p className="text-xs text-slate-400">Pesan slot penjemputan sekarang sebelum kuota armada penuh.</p>
          </div>
          <Link
            href="/booking"
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            Booking Penjemputan Kamar →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
