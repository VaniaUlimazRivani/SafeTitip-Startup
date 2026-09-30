import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">SafeTitip</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Layanan penitipan barang kos aman, terpercaya, dan bebas rugi kos kosong untuk mahasiswa saat libur semester.
            </p>
            <p className="text-[11px] text-slate-500">
              Proyek Magang Resmi Inatechno Batch 9 — Tim A (Gilang, Fauzan, Hasan, Vania).
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Fitur & Navigasi</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda Utama</Link></li>
              <li><Link href="/booking" className="hover:text-white transition-colors">Formulir Booking</Link></li>
              <li><Link href="/kalkulator" className="hover:text-white transition-colors">Simulasi Biaya</Link></li>
              <li><Link href="/keamanan" className="hover:text-white transition-colors">Standar Keamanan SOP</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Akses Internal</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/admin" className="text-blue-400 hover:text-blue-300 font-semibold">Dashboard Admin</Link></li>
              <li><span className="text-slate-500">Cakupan Wilayah: Kota Padang (UNAND, UNP, UPI YPTK, UBH) & Sekitarnya</span></li>
              <li><span className="text-slate-500">Layanan: Jemput Kamar & Antar Kembali</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; 2026 SafeTitip Express & Care. All rights reserved.</p>
          <p>Dibuat untuk evaluasi resmi 3-Day MVP Sprint.</p>
        </div>
      </div>
    </footer>
  );
}
