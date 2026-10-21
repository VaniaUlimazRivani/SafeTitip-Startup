import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1E1510] text-[#C4B2A3] py-14 border-t border-[#38261C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#38261C]">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] flex items-center justify-center text-white font-bold shadow-md shadow-black/30">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <span className="font-extrabold text-2xl text-[#FAF6F0] tracking-tight">Kosinaja</span>
            </div>
            <p className="text-xs text-[#A89688] max-w-sm leading-relaxed">
              Layanan penitipan barang kos aman, terpercaya, dan bebas rugi kos kosong untuk mahasiswa saat libur semester di Kota Padang.
            </p>
            <p className="text-[11px] text-[#8C7A6D]">
              Instagram: <span className="text-[#E69526] font-semibold">@kosinaja.id</span> • Layanan Terpercaya Mahasiswa Padang.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF6F0]">Fitur & Navigasi</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/" className="hover:text-[#FAF6F0] transition-colors">Beranda Utama</Link></li>
              <li><Link href="/booking" className="hover:text-[#FAF6F0] transition-colors">Formulir Booking</Link></li>
              <li><Link href="/kalkulator" className="hover:text-[#FAF6F0] transition-colors">Simulasi Biaya</Link></li>
              <li><Link href="/keamanan" className="hover:text-[#FAF6F0] transition-colors">Standar Keamanan SOP</Link></li>
              <li><Link href="/faq" className="hover:text-[#FAF6F0] transition-colors">Tanya Jawab (FAQ)</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF6F0]">Akses Internal</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/admin/login" className="text-[#E69526] hover:text-[#FBBF24] font-semibold">Portal Login Admin</Link></li>
              <li><span className="text-[#8C7A6D]">Cakupan Wilayah: Kota Padang (UNAND, UNP, UPI YPTK, UBH) & Sekitarnya</span></li>
              <li><span className="text-[#8C7A6D]">Layanan: Jemput Kamar & Antar Kembali</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7A6D] gap-3">
          <p>&copy; 2026 Kosinaja (kosinaja.id). All rights reserved.</p>
          <p>Titip Barang Kos Aman & Nyaman.</p>
        </div>
      </div>
    </footer>
  );
}
