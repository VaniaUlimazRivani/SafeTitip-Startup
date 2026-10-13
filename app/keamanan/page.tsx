import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function KeamananPage() {
  const sopSteps = [
    {
      step: '01',
      title: 'Penjemputan Langsung di Alamat',
      desc: 'Kurir resmi SafeTitip mendatangi alamat kos, rumah tinggal, atau kantor Anda di Kota Padang membawa armada khusus dan tanda pengenal resmi.',
      icon: 'local_shipping',
      badge: 'Armada Siaga',
    },
    {
      step: '02',
      title: 'Pemasangan Segel Barcode Bersama',
      desc: 'Pengecekan fisik luar bersama Anda, penempelan security seal anti-tamper ber-barcode unik di setiap celah tutup barang, dan foto dokumentasi 360°.',
      icon: 'qr_code_scanner',
      badge: 'Anti-Bongkar',
    },
    {
      step: '03',
      title: 'Penyimpanan Gudang Berpalet & CCTV',
      desc: 'Barang ditata rapi di rak dan palet kayu kering bebas risiko banjir atau lembab, diawasi sensor dan kamera CCTV 24 jam non-stop.',
      icon: 'warehouse',
      badge: 'Palet Kayu Kering',
    },
    {
      step: '04',
      title: 'Pengantaran Kembali & Verifikasi Segel',
      desc: 'Armada mengantar barang kembali ke alamat Anda. Nomor barcode segel dicocokkan dan diverifikasi utuh di hadapan Anda sebelum serah terima selesai.',
      icon: 'verified',
      badge: 'Garansi Utuh',
    },
  ];

  const pilarList = [
    {
      icon: 'qr_code_scanner',
      title: 'Segel Barcode Unik Anti-Tamper',
      color: 'bg-blue-100 text-blue-700',
      badge: 'Keamanan Fisik',
      desc: 'Setiap dus, koper, dan elektronik ditempel segel keamanan ber-barcode unik. Jika segel dibuka paksa, akan meninggalkan jejak void yang langsung terdeteksi oleh sistem scan kurir.',
    },
    {
      icon: 'lock',
      title: 'Privasi Mutlak — Dilarang Buka Isi',
      color: 'bg-indigo-100 text-indigo-700',
      badge: 'Hak Privasi',
      desc: 'SOP SafeTitip melarang keras staf atau kurir membuka isi dus atau koper pelanggan. Segel ditempel di hadapan Anda, sehingga privasi pakaian dan barang pribadi terlindungi 100%.',
    },
    {
      icon: 'chat',
      title: 'Laporan Berkala Mingguan (WhatsApp)',
      color: 'bg-emerald-100 text-emerald-700',
      badge: 'Transparansi',
      desc: 'Anda tidak perlu cemas saat mudik atau dinas luar kota. Tim gudang secara berkala mengirimkan laporan kondisi fisik dan foto barang Anda melalui pesan WhatsApp setiap minggu.',
    },
    {
      icon: 'verified_user',
      title: 'Garansi Kompensasi Penuh Resmi',
      color: 'bg-purple-100 text-purple-700',
      badge: 'Jaminan Klaim',
      desc: 'Setiap pesanan dilindungi Berita Acara Digital. Jika terjadi kehilangan atau kerusakan akibat kelalaian operasional, SafeTitip memberikan kompensasi ganti rugi resmi 1x24 jam.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-16">
        
        {/* Header Section */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Standar Mutu Operasional & Keamanan
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Standar SOP Gudang & Privasi Terjamin
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Solusi penitipan barang terpercaya di Kota Padang dengan proteksi segel barcode fisik, gudang ber-CCTV 24 jam, dan privasi yang terlindungi 100%.
            </p>
          </div>
        </ScrollReveal>

        {/* Visual Hero Showcase: Warehouse Image with Floating Badges */}
        <ScrollReveal direction="up" delay={100}>
          <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-slate-900 group">
            <img
              src="/images/warehouse.jpg"
              alt="Gudang Aman SafeTitip Padang"
              className="w-full h-[320px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>

            {/* Floating Badge: CCTV 24 Jam */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white shadow-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <p className="text-xs font-extrabold text-slate-900">CCTV 24 Jam Non-Stop</p>
            </div>

            {/* Floating Badge: WhatsApp Update */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white shadow-lg hidden sm:flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">chat</span>
              <p className="text-xs font-extrabold text-slate-900">Update Kondisi Mingguan</p>
            </div>

            {/* Bottom Caption Showcase */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 text-white">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  Fasilitas Terverifikasi Bebas Banjir
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold">Gudang Kering Beralas Palet Kayu</h2>
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                  Semua barang ditempatkan di atas palet kayu pelindung agar tidak bersentuhan langsung dengan lantai, menjaga pakaian dan dokumen bebas dari lembab dan jamur.
                </p>
              </div>
              <Link
                href="/booking"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Pesan Slot Penjemputan</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Visual Timeline SOP 4 Tahap Penanganan */}
        <div className="space-y-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                Alur Kerja Terstandar
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                SOP Penanganan Barang 4 Tahap
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Langkah pengamanan sistematis sejak barang dijemput hingga kembali ke tangan Anda.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sopSteps.map((s, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 100} className="h-full">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-full space-y-4 hover:border-blue-400 hover:shadow-lg transition-all group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-blue-600/30 group-hover:text-blue-600 transition-colors">
                        {s.step}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-100">
                        {s.badge}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* 4 Pilar Proteksi & Privasi */}
        <div className="space-y-6">
          <ScrollReveal direction="up">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase tracking-wider">
                Kepercayaan Pengguna
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                4 Pilar Proteksi & Privasi SafeTitip
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Prinsip keamanan utama yang melindungi hak pelanggan dan keutuhan barang.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {pilarList.map((p, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 100} className="h-full">
                <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${p.color} flex items-center justify-center font-bold`}>
                        <span className="material-symbols-outlined text-[28px]">{p.icon}</span>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Kebijakan Penolakan Barang Terlarang */}
        <ScrollReveal direction="up">
          <div className="p-8 rounded-3xl bg-rose-50/80 border border-rose-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <div>
                <h3 className="font-extrabold text-rose-900 text-base">Aturan Keselamatan & Kebijakan Barang Ditolak</h3>
                <p className="text-xs text-rose-700 mt-0.5">Demi keselamatan bersama seluruh barang yang tersimpan di gudang:</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-rose-950 font-semibold pt-2">
              <div className="p-3 bg-white/90 rounded-2xl border border-rose-200/80 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-rose-600 text-[20px] shrink-0">no_meals</span>
                <span>Makanan atau minuman yang mudah basi / membusuk</span>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-rose-200/80 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-rose-600 text-[20px] shrink-0">payments</span>
                <span>Uang tunai, perhiasan emas, dan surat berharga</span>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-rose-200/80 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-rose-600 text-[20px] shrink-0">pets</span>
                <span>Hewan peliharaan hidup & bahan kimia berbahaya</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Banner */}
        <ScrollReveal direction="up">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-extrabold">Barang Titipan Anda Terjamin 100% Aman</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Pesan jadwal penjemputan sekarang. Armada SafeTitip siap mendatangi alamat Anda di Kota Padang.
              </p>
            </div>
            <Link
              href="/booking"
              className="px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all shrink-0 flex items-center gap-2"
            >
              <span>Pesan Penjemputan Sekarang</span>
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            </Link>
          </div>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}
