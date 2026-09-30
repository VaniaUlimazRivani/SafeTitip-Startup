import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function KeamananPage() {
  const pilarList = [
    {
      icon: 'lock',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Standar Mutu Layanan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Standar Operasional Prosedur (SOP) Keamanan
          </h1>
          <p className="text-sm text-slate-600">
            Kami memastikan barang kos Anda tetap utuh, bersih, dan aman hingga masa libur kuliah berakhir.
          </p>
        </div>

        {/* 4 Pilar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pilarList.map((p, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className={`w-14 h-14 rounded-2xl ${p.color} flex items-center justify-center font-bold`}>
                <span className="material-symbols-outlined text-[32px]">{p.icon}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{p.title}</h3>
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
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200">
              ❌ Makanan / Minuman mudah basi/busuk
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200">
              ❌ Uang tunai, logam mulia & perhiasan
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200">
              ❌ Hewan hidup, zat berbahaya, senjata
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-extrabold">Siap Menitipkan Barang Anda?</h3>
            <p className="text-xs text-slate-400">Pemesanan slot jemput kamar dibuka setiap periode liburan.</p>
          </div>
          <Link
            href="/booking"
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all shrink-0"
          >
            Booking Penjemputan Sekarang →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
