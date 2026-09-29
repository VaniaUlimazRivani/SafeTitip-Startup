'use client';

import { HARGA } from '@/lib/constants/harga';

interface QuotationCardProps {
  kategori: 'A' | 'B' | 'CUSTOM' | null;
  durasiBulan: 1 | 2 | 3;
}

const KATEGORI_LABEL: Record<string, { label: string; desc: string; color: string }> = {
  A: {
    label: 'Kategori A',
    desc: 'Barang kecil & elektronik ringan',
    color: 'from-blue-500 to-cyan-400',
  },
  B: {
    label: 'Kategori B',
    desc: 'Barang besar & elektronik besar',
    color: 'from-violet-500 to-purple-400',
  },
};

const DURASI_OPTIONS: { value: 1 | 2 | 3; label: string; badge?: string }[] = [
  { value: 1, label: '1 Bulan' },
  { value: 2, label: '2 Bulan', badge: 'Populer' },
  { value: 3, label: '3 Bulan', badge: 'Hemat' },
];

function formatRupiah(angka: number) {
  return `Rp ${angka.toLocaleString('id-ID')}`;
}

export default function QuotationCard({ kategori, durasiBulan }: QuotationCardProps) {
  // ── State IDLE: belum ada barang diisi ─────────────────────────────────────
  if (!kategori) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center">
        <div className="mb-3 flex justify-center">
          <div className="rounded-full bg-slate-800 p-3">
            <svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-400">Estimasi Harga</p>
        <p className="mt-1 text-xs text-slate-600">
          Isi daftar barang untuk melihat estimasi harga otomatis
        </p>
      </div>
    );
  }

  // ── State CUSTOM: kendaraan / volume >7 ───────────────────────────────────
  if (kategori === 'CUSTOM') {
    return (
      <div className="overflow-hidden rounded-2xl border border-orange-500/30 bg-orange-500/5">
        <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-500/20 p-2">
              <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-300">Butuh Penanganan Khusus</p>
              <p className="text-xs text-orange-400/70">Kategori CUSTOM</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm leading-relaxed text-slate-400">
            Barang Anda terdeteksi sebagai{' '}
            <span className="font-medium text-orange-300">kategori khusus</span>.
            Harga akan dinegosiasikan langsung oleh Admin via WhatsApp setelah booking diterima.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-3">
            <svg className="h-4 w-4 shrink-0 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.029 18.88a9.896 9.896 0 01-4.988-1.338l-.36-.214-3.724.976.993-3.624-.234-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.946 9.884z" />
            </svg>
            <p className="text-xs text-slate-400">Admin akan menghubungi Anda via WhatsApp</p>
          </div>
        </div>
      </div>
    );
  }

  // ── State SUCCESS: Kategori A atau B ──────────────────────────────────────
  const info = KATEGORI_LABEL[kategori];
  const hargaTable = HARGA[kategori];
  const totalHarga = hargaTable ? hargaTable[durasiBulan] : 0;
  const hargaPerBulan = Math.round(totalHarga / durasiBulan);
  const savings = hargaTable && durasiBulan > 1 ? hargaTable[1] * durasiBulan - totalHarga : 0;

  if (!info || !hargaTable) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
      {/* Header Kategori dengan gradient border */}
      <div className={`bg-gradient-to-r ${info.color} p-px`}>
        <div className="bg-slate-950/80 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estimasi Harga
              </p>
              <p className={`mt-1 text-lg font-bold bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                {info.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{info.desc}</p>
            </div>
            <div className={`rounded-xl bg-gradient-to-br ${info.color} p-0.5`}>
              <div className="rounded-[10px] bg-slate-950 px-3 py-1.5">
                <p className={`text-xl font-black bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                  {kategori}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Durasi Interaktif */}
      <div className="px-6 py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
          Pilihan Durasi
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DURASI_OPTIONS.map((opt) => {
            const isActive = opt.value === durasiBulan;
            const hargaOpt = hargaTable[opt.value];
            return (
              <div key={opt.value} className="relative">
                {isActive ? (
                  <div className={`rounded-xl bg-gradient-to-b ${info.color} p-px`}>
                    <div className="rounded-[10px] bg-slate-950 p-2.5">
                      {opt.badge && (
                        <span
                          className={`mb-1.5 inline-block rounded-full bg-gradient-to-r ${info.color} px-2 py-0.5 text-[10px] font-bold text-white`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      <p className="text-xs font-medium text-slate-300">{opt.label}</p>
                      <p className={`mt-1 text-sm font-bold bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                        {formatRupiah(hargaOpt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 opacity-50">
                    {opt.badge && (
                      <span className="mb-1.5 inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                        {opt.badge}
                      </span>
                    )}
                    <p className="text-xs font-medium text-slate-500">{opt.label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-600">{formatRupiah(hargaOpt)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Harga */}
      <div className="mx-6 mb-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
        <div className="divide-y divide-slate-800">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-slate-500">Harga per Bulan</span>
            <span className="text-sm font-semibold text-slate-300">{formatRupiah(hargaPerBulan)}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-slate-500">Durasi</span>
            <span className="text-sm font-semibold text-slate-300">{durasiBulan} Bulan</span>
          </div>
          {savings > 0 && (
            <div className="flex items-center justify-between bg-green-500/5 px-4 py-3">
              <span className="text-xs text-green-500">Hemat dibanding bulanan</span>
              <span className="text-sm font-semibold text-green-400">- {formatRupiah(savings)}</span>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-sm font-bold text-white">Total Estimasi</span>
            <span className={`text-xl font-black bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
              {formatRupiah(totalHarga)}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-6 pb-5">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
          <svg
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Harga bersifat estimasi. Konfirmasi final dilakukan Admin setelah barang diperiksa.
        </p>
      </div>
    </div>
  );
}
