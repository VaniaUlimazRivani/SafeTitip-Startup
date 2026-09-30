import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Bagaimana cara menentukan apakah barang saya masuk Kategori A atau Kategori B?',
      a: 'Kategori A berlaku untuk barang berukuran kecil/sedang seperti dus buku, dus pakaian, dan elektronik kecil (kipas angin meja, magic com mini) dengan jumlah maksimal 3 unit. Jika ada barang besar seperti kulkas mini, dispenser besar, atau volume barang antara 4 hingga 7 unit, otomatis sistem akan mengklasifikasikan sebagai Kategori B.',
    },
    {
      q: 'Apakah sepeda motor bisa dititipkan di SafeTitip?',
      a: 'Bisa, namun sepeda motor masuk ke dalam skema Custom Quotation (BR-A-P0-04a). Sebelum disimpan di gudang, kurir akan melakukan inspeksi fisik kelengkapan surat kendaraan (STNK), dokumentasi kilometer, dan pelepasan aki demi keselamatan.',
    },
    {
      q: 'Bagaimana proses penjemputan barang di kos saya?',
      a: 'Setelah formulir pemesanan terkonfirmasi, kurir SafeTitip akan datang ke kamar kos Anda sesuai tanggal dan slot waktu yang dipilih. Kurir akan membantu pengecekan barang, penempelan segel barcode unik, dan foto dokumentasi 360° sebelum barang dibawa.',
    },
    {
      q: 'Barang apa saja yang dilarang untuk dititipkan?',
      a: 'Sesuai regulasi keamanan BR-A-P0-04: makanan mudah basi, uang tunai, perhiasan emas/berlian, hewan peliharaan, senjata tajam/api, dan obat-obatan terlarang (narkotika) ditolak secara otomatis oleh sistem.',
    },
    {
      q: 'Kapan barang saya akan diantar kembali ke kos?',
      a: 'Barang akan diantar kembali ke kamar kos Anda sesuai tanggal berakhirnya masa sewa atau saat Anda mengonfirmasi jadwal kepulangan melalui kontak admin SafeTitip.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">help</span>
            Pusat Bantuan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h1>
          <p className="text-sm text-slate-600">
            Temukan jawaban atas pertanyaan umum seputar layanan penitipan barang kos SafeTitip.
          </p>
        </div>

        {/* Accordion / List */}
        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2 hover:border-blue-200 transition-colors"
            >
              <h3 className="font-extrabold text-slate-900 text-base flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  Q{idx + 1}
                </span>
                <span>{f.q}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-10">{f.a}</p>
            </div>
          ))}
        </div>

        {/* Help Banner */}
        <div className="p-8 rounded-3xl bg-blue-50 border border-blue-200 text-center space-y-3">
          <h3 className="font-extrabold text-blue-900 text-lg">Punya Pertanyaan Lain yang Belum Terjawab?</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Tim layanan pelanggan kami siap membantu Anda melalui konsultasi WhatsApp.
          </p>
          <div className="pt-2">
            <Link
              href="/booking"
              className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Lanjutkan ke Form Pemesanan →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
