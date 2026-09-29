'use client';

interface BookingResultProps {
  result: any;
  onReset: () => void;
}

function formatRupiah(angka: number) {
  return `Rp ${angka.toLocaleString('id-ID')}`;
}

function formatTanggal(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BookingResult({ result, onReset }: BookingResultProps) {
  const isCustom = result.kategori === 'CUSTOM';
  const booking = result.booking;
  const quotation = result.quotation;

  return (
    <div className="space-y-6 py-4">
      {/* Success Header */}
      <div className="text-center">
        <div
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border ${
            isCustom
              ? 'border-orange-500/30 bg-orange-500/10'
              : 'border-green-500/30 bg-green-500/10'
          }`}
        >
          {isCustom ? (
            <svg className="h-9 w-9 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ) : (
            <svg className="h-9 w-9 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h2 className="text-2xl font-bold text-white">
          {isCustom ? 'Booking Diterima!' : 'Booking Berhasil!'}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {isCustom
            ? 'Admin akan menghubungi Anda segera'
            : 'Booking Anda telah dikonfirmasi otomatis'}
        </p>
      </div>

      {/* Kode Booking */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Kode Booking Anda
        </p>
        <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
          <span className="font-mono text-xl font-bold tracking-widest text-white">
            {booking?.kodeBooking}
          </span>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(booking?.kodeBooking ?? '')}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            Salin
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Simpan kode ini untuk cek status penitipan Anda
        </p>
      </div>

      {/* Quotation Box */}
      {isCustom ? (
        <div className="overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/5">
          <div className="flex items-start gap-4 p-5">
            <div className="mt-0.5 flex-shrink-0 rounded-full bg-orange-500/10 p-2">
              <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-300">Perlu Penawaran Harga Khusus</p>
              <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                Sistem mendeteksi barang Anda sebagai <span className="font-medium text-orange-300">Kategori CUSTOM</span>.
                Tim admin akan menghubungi nomor WhatsApp Anda dalam 1×24 jam untuk memberikan penawaran harga terbaik.
              </p>
            </div>
          </div>
          <div className="border-t border-orange-500/10 bg-orange-500/5 px-5 py-3">
            <p className="text-xs text-orange-400/60">
              ⏱ Estimasi respons admin: 1–24 jam kerja
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-950/60">
          <div className="border-b border-slate-800 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rincian Quotation
            </p>
          </div>
          <div className="divide-y divide-slate-800/60">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-slate-400">Kategori Barang</span>
              <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-sm font-bold text-blue-300">
                Kategori {result.kategori}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-slate-400">Harga per Bulan</span>
              <span className="text-sm font-semibold text-white">
                {formatRupiah(quotation?.hargaPerBulan ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-slate-400">Durasi Titip</span>
              <span className="text-sm font-semibold text-white">
                {quotation?.durasiBulan} Bulan
              </span>
            </div>
            {booking?.tanggalPickup && (
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-slate-400">Tanggal Pickup</span>
                <span className="text-sm font-semibold text-white">
                  {formatTanggal(booking.tanggalPickup)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-5 py-4">
              <span className="text-base font-bold text-white">Total Harga</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                {formatRupiah(quotation?.totalHarga ?? 0)}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="border-t border-slate-800 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <p className="text-xs text-green-400 font-medium">Booking APPROVED — Pembayaran dikonfirmasi saat pickup</p>
            </div>
          </div>
        </div>
      )}

      {/* Daftar Barang */}
      {booking?.items && booking.items.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Barang yang Dititipkan
          </p>
          <ul className="space-y-2">
            {booking.items.map((item: any, i: number) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-slate-300">{item.namaBarang}</span>
                </div>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                  ×{item.jumlah}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="grid gap-3">
        <a
          href={`https://wa.me/6281234567890?text=Halo+Admin+SafeTitip%2C+kode+booking+saya+adalah+${booking?.kodeBooking}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 py-3 text-sm font-semibold text-green-400 transition-all hover:bg-green-500/20"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.029 18.88a9.896 9.896 0 01-4.988-1.338l-.36-.214-3.724.976.993-3.624-.234-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.946 9.884z" />
          </svg>
          Hubungi Admin via WhatsApp
        </a>
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700"
        >
          Buat Booking Baru
        </button>
      </div>
    </div>
  );
}
