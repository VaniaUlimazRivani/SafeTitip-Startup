'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BookingItem {
  id?: string;
  namaBarang: string;
  tipe?: string;
  jumlah: number;
}

interface BookingRecord {
  id: string;
  kodeBooking: string;
  userId: string;
  kategori: string;
  durasiBulan: number;
  totalHarga: number;
  status: string;
  paymentStatus?: string;
  tanggalPickup?: string;
  lokasiPickup?: string;
  metodePickup?: string;
  metodeDelivery?: string;
  totalOngkir?: number;
  createdAt: string;
  items?: BookingItem[];
  quotation?: {
    hargaPerBulan?: number;
    totalHarga?: number;
  };
  conditionReport?: {
    status?: string;
    picKurir?: string;
    fotoBefore?: string;
    fotoAfter?: string;
  };
  weeklyUpdates?: Array<{
    mingguKe: number;
    keterangan?: string;
    foto?: string;
    tanggalUpdate: string;
  }>;
  payment?: {
    orderId?: string;
    amount?: number;
    status?: string;
    paymentType?: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();

  // State Pengguna & Sesi
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'riwayat' | 'keamanan'>('profil');

  // State Statistik
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
  });

  // State Form Edit Profil
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    noWa: '',
    alamat: '',
  });

  // State Form Ganti Kata Sandi
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // State Riwayat Booking
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'UNPAID'>('ALL');
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<BookingRecord | null>(null);

  // State Midtrans Payment Action
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);

  // 1. Cek Sesi Pengguna di LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('safetitip_user_session');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
          setFormData({
            nama: parsed.nama || '',
            email: parsed.email || '',
            noWa: parsed.noWa || '',
            alamat: parsed.alamat || '',
          });
        } catch (e) {
          console.error('Gagal parse session:', e);
        }
      }
      setIsSessionLoaded(true);
    }
  }, []);

  // 2. Fetch Data Profil & Riwayat Booking dari API
  const fetchProfileAndBookings = async (userId: string) => {
    try {
      setBookingsLoading(true);

      // Ambil profile & stats
      const profileRes = await fetch(`/api/user/profile?userId=${userId}`);
      if (profileRes.ok) {
        const pData = await profileRes.json();
        if (pData.success && pData.user) {
          setFormData((prev) => ({
            ...prev,
            nama: pData.user.nama || prev.nama,
            email: pData.user.email || prev.email,
            noWa: pData.user.noWa || prev.noWa,
            alamat: pData.user.alamat || prev.alamat,
          }));
          if (pData.stats) {
            setStats(pData.stats);
          }
        }
      }

      // Ambil daftar booking pengguna
      const bookingsRes = await fetch(`/api/bookings?userId=${userId}`);
      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        if (Array.isArray(bData)) {
          setBookings(bData);
          // Hitung ulang stats jika dari booking array
          const active = bData.filter((b) => ['LEAD', 'APPROVED', 'PICKUP_SCHEDULED', 'IN_STORAGE'].includes(b.status)).length;
          const completed = bData.filter((b) => ['DELIVERED', 'COMPLETED'].includes(b.status)).length;
          setStats({
            totalBookings: bData.length,
            activeBookings: active,
            completedBookings: completed,
          });
        }
      }
    } catch (err) {
      console.error('Error saat fetch profile data:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchProfileAndBookings(currentUser.id);
    }
  }, [currentUser?.id]);

  // Handle Update Profil Diri
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    setUpdateLoading(true);
    setFeedback(null);

    try {
      const payload: any = {
        userId: currentUser.id,
        nama: formData.nama,
        noWa: formData.noWa,
        alamat: formData.alamat,
      };

      if (passwordForm.newPassword) {
        if (!passwordForm.currentPassword) {
          throw new Error('Masukkan kata sandi saat ini untuk mengganti kata sandi.');
        }
        if (passwordForm.newPassword.length < 6) {
          throw new Error('Kata sandi baru minimal 6 karakter.');
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          throw new Error('Konfirmasi kata sandi baru tidak cocok.');
        }
        payload.currentPassword = passwordForm.currentPassword;
        payload.newPassword = passwordForm.newPassword;
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal memperbarui profil.');
      }

      // Update localStorage session
      const updatedSession = {
        ...currentUser,
        nama: result.user.nama,
        noWa: result.user.noWa,
        alamat: result.user.alamat,
      };
      localStorage.setItem('safetitip_user_session', JSON.stringify(updatedSession));
      setCurrentUser(updatedSession);

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setFeedback({ type: 'success', message: 'Profil Anda berhasil diperbarui!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle Pembayaran Midtrans Snap
  const handlePayBooking = async (booking: BookingRecord) => {
    try {
      setPaymentLoadingId(booking.id);
      const res = await fetch('/api/payments/snap-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Gagal memproses pembayaran Midtrans.');
        return;
      }

      const { token, redirectUrl } = data.data;

      // Jika Midtrans Snap JS tersedia di window, buka pop-up Snap, jika tidak buka redirectUrl
      if (typeof window !== 'undefined' && (window as any).snap) {
        (window as any).snap.pay(token, {
          onSuccess: function (result: any) {
            alert('Pembayaran berhasil! Status penitipan akan segera diperbarui.');
            if (currentUser?.id) fetchProfileAndBookings(currentUser.id);
          },
          onPending: function (result: any) {
            alert('Menunggu pembayaran Anda diselesaikan.');
            if (currentUser?.id) fetchProfileAndBookings(currentUser.id);
          },
          onError: function (result: any) {
            alert('Pembayaran gagal atau dibatalkan.');
          },
          onClose: function () {
            if (currentUser?.id) fetchProfileAndBookings(currentUser.id);
          },
        });
      } else if (redirectUrl) {
        window.open(redirectUrl, '_blank');
      } else {
        alert('Token pembayaran didapat: ' + token);
      }
    } catch (error: any) {
      alert('Terjadi kesalahan saat memproses pembayaran: ' + error.message);
    } finally {
      setPaymentLoadingId(null);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('safetitip_user_session');
      setCurrentUser(null);
      router.push('/login');
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LEAD':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Menunggu Konfirmasi</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Disetujui Admin</span>;
      case 'PICKUP_SCHEDULED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">Jadwal Penjemputan</span>;
      case 'IN_STORAGE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Di Gudang Aman</span>;
      case 'DELIVERED':
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">Selesai / Terkirim</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">Dibatalkan</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    if (paymentStatus === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          Lunas
        </span>
      );
    }
    if (paymentStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-300">
          <span className="material-symbols-outlined text-[14px]">pending</span>
          Menunggu Pembayaran
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-300">
        <span className="material-symbols-outlined text-[14px]">payments</span>
        Belum Bayar
      </span>
    );
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    if (selectedStatusFilter === 'ALL') return true;
    if (selectedStatusFilter === 'ACTIVE') {
      return ['LEAD', 'APPROVED', 'PICKUP_SCHEDULED', 'IN_STORAGE'].includes(b.status);
    }
    if (selectedStatusFilter === 'COMPLETED') {
      return ['DELIVERED', 'COMPLETED'].includes(b.status);
    }
    if (selectedStatusFilter === 'UNPAID') {
      return b.paymentStatus !== 'PAID';
    }
    return true;
  });

  // Tampilan Belum Login
  if (isSessionLoaded && !currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EBD8C6] shadow-xl text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] flex items-center justify-center text-white shadow-lg shadow-[#B86B35]/25 mb-6">
              <span className="material-symbols-outlined text-[40px]">person_off</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#2A1B14] mb-2">Akses Akun Kosinaja</h1>
            <p className="text-sm text-[#705E54] leading-relaxed mb-8">
              Silakan masuk ke akun Anda terlebih dahulu untuk melihat informasi profil pribadi dan melacak riwayat penitipan barang kos Anda.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-[#B86B35] hover:bg-[#9B5424] text-white font-bold text-sm transition-all shadow-md shadow-[#B86B35]/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Masuk ke Akun</span>
              </Link>
              <Link
                href="/login?mode=register"
                className="w-full py-3.5 px-4 rounded-xl bg-[#F6ECE1] hover:bg-[#EBD8C6] text-[#622F12] font-bold text-sm transition-all border border-[#EBD8C6] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Daftar Akun Mahasiswa Baru</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A1B14]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Nav */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#705E54] mb-6">
          <Link href="/" className="hover:text-[#B86B35] transition-colors">Beranda</Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#B86B35] font-bold">Profil Pengguna</span>
        </div>

        {/* HERO HEADER PROFILE CARD */}
        <div className="relative rounded-3xl bg-white border border-[#EBD8C6] shadow-sm mb-8 overflow-hidden">
          {/* Cover Header Banner */}
          <div className="h-28 sm:h-36 bg-gradient-to-r from-[#B86B35] via-[#C97B45] to-[#E69526] relative">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          <div className="px-6 sm:px-10 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* Avatar & User Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                {/* Floating Avatar */}
                <div className="-mt-14 sm:-mt-16 relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 shadow-xl border-4 border-white">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.nama}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#B86B35] to-[#E69526] flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold shadow-inner">
                        {currentUser?.nama?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs"
                    title="Akun Aktif"
                  >
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                </div>

                {/* User Details - Bersih di bawah banner */}
                <div className="pt-1 sm:pt-3 space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B14] tracking-tight">
                      {currentUser?.nama || 'Pengguna SafeTitip'}
                    </h1>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F6ECE1] text-[#B86B35] border border-[#EBD8C6] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Mahasiswa Terverifikasi
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#705E54] flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#B86B35]">mail</span>
                      {currentUser?.email || '-'}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#B86B35]">phone_iphone</span>
                      {currentUser?.noWa || 'Belum ada nomor WA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
                <Link
                  href="/booking"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#B86B35] hover:bg-[#9B5424] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#B86B35]/20 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">add_box</span>
                  <span>Booking Penitipan</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-[#705E54] hover:text-rose-600 border border-slate-200 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                  title="Keluar dari akun"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 STATS METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#EBD8C6] shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#705E54] uppercase tracking-wider">Total Penitipan</p>
              <h3 className="text-2xl font-extrabold text-[#2A1B14]">{stats.totalBookings}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EBD8C6] shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">sync</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#705E54] uppercase tracking-wider">Sedang Aktif</p>
              <h3 className="text-2xl font-extrabold text-blue-600">{stats.activeBookings}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EBD8C6] shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#705E54] uppercase tracking-wider">Selesai / Terkirim</p>
              <h3 className="text-2xl font-extrabold text-emerald-600">{stats.completedBookings}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EBD8C6] shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">credit_card</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#705E54] uppercase tracking-wider">Midtrans Gateway</p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Terhubung</span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-[#E8DDD3] mb-8 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profil')}
            className={`pb-3.5 px-4 text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'profil'
                ? 'border-[#B86B35] text-[#B86B35]'
                : 'border-transparent text-[#705E54] hover:text-[#2A1B14]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            <span>Informasi Profil & Akun</span>
          </button>

          <button
            onClick={() => setActiveTab('riwayat')}
            className={`pb-3.5 px-4 text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'riwayat'
                ? 'border-[#B86B35] text-[#B86B35]'
                : 'border-transparent text-[#705E54] hover:text-[#2A1B14]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Riwayat Penitipan Barang</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-[#F6ECE1] text-[#B86B35]">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('keamanan')}
            className={`pb-3.5 px-4 text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'keamanan'
                ? 'border-[#B86B35] text-[#B86B35]'
                : 'border-transparent text-[#705E54] hover:text-[#2A1B14]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shield</span>
            <span>Keamanan & SOP Gudang</span>
          </button>
        </div>

        {/* TAB 1: INFORMASI PROFIL & EDIT DATA */}
        {activeTab === 'profil' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBD8C6] shadow-sm">
                <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#E8DDD3]">
                  <div className="w-10 h-10 rounded-xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">badge</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#2A1B14]">Data Pribadi Mahasiswa</h2>
                    <p className="text-xs text-[#705E54]">Pastikan nomor WhatsApp aktif untuk koordinasi tim kurir penjemputan barang.</p>
                  </div>
                </div>

                {feedback && (
                  <div
                    className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {feedback.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span>{feedback.message}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold text-[#421E0B] uppercase tracking-wider mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#EBD8C6] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B86B35] text-sm font-semibold transition-all"
                        placeholder="Contoh: Ahmad Zaky"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#421E0B] uppercase tracking-wider mb-2">
                        Alamat Email (Akun Terdaftar)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={formData.email}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold text-[#421E0B] uppercase tracking-wider mb-2">
                        Nomor WhatsApp (Aktif)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.noWa}
                        onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#EBD8C6] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B86B35] text-sm font-semibold transition-all"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#421E0B] uppercase tracking-wider mb-2">
                        Wilayah / Kota Layanan
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Kota Padang, Sumatera Barat"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-sm font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#421E0B] uppercase tracking-wider mb-2">
                      Alamat Kos / Penjemputan Default di Padang
                    </label>
                    <textarea
                      rows={3}
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#EBD8C6] bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B86B35] text-sm font-semibold transition-all"
                      placeholder="Contoh: Kos Melati No. 15, Jl. Moh. Hatta, Pauh, Padang"
                    />
                  </div>

                  {/* Bagian Ganti Kata Sandi (Opsional) */}
                  <div className="pt-6 mt-6 border-t border-[#E8DDD3]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-[#2A1B14]">Ubah Kata Sandi</h3>
                        <p className="text-xs text-[#705E54]">Kosongkan bila Anda tidak ingin mengubah kata sandi.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs font-bold text-[#B86B35] hover:underline"
                      >
                        {showPassword ? 'Sembunyikan' : 'Tampilkan Sandi'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBD8C6] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#B86B35]"
                          placeholder="Kata Sandi Saat Ini"
                        />
                      </div>
                      <div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBD8C6] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#B86B35]"
                          placeholder="Kata Sandi Baru"
                        />
                      </div>
                      <div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBD8C6] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#B86B35]"
                          placeholder="Ulangi Sandi Baru"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-6 py-3 rounded-xl bg-[#B86B35] hover:bg-[#9B5424] text-white font-extrabold text-sm transition-all shadow-md shadow-[#B86B35]/20 disabled:opacity-50 flex items-center gap-2"
                    >
                      {updateLoading && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>Simpan Perubahan Profil</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Ringkasan Akun */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#F6ECE1] to-white p-6 rounded-3xl border border-[#EBD8C6] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#B86B35] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#2A1B14]">Keuntungan Anggota</h3>
                    <p className="text-[11px] text-[#705E54]">SafeTitip Protection Program</p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-[#513E34] font-medium">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span>Dokumentasi foto fisik barang <em>before & after wrapping</em> transparan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span>Monitoring berkala kondisi gudang lewat fitur update mingguan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span>Sistem pembayaran otomatis Midtrans tanpa perlu konfirmasi manual berbelit.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EBD8C6] shadow-sm text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[24px]">support_agent</span>
                </div>
                <h4 className="text-sm font-extrabold text-[#2A1B14] mb-1">Butuh Bantuan Khusus?</h4>
                <p className="text-xs text-[#705E54] mb-4">Admin Kosinaja siap membantu perubahan jadwal pickup atau barang custom.</p>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20Kosinaja,%20saya%20ingin%20bertanya%20mengenai%20penitipan%20barang"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Hubungi WhatsApp Admin</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RIWAYAT PENITIPAN & MIDTRANS PAYMENT */}
        {activeTab === 'riwayat' && (
          <div className="space-y-6">
            {/* Filter Status Sub-Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EBD8C6]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#705E54] mr-2">Filter Status:</span>
                {[
                  { id: 'ALL', label: 'Semua Status' },
                  { id: 'ACTIVE', label: 'Sedang Berjalan' },
                  { id: 'COMPLETED', label: 'Selesai' },
                  { id: 'UNPAID', label: 'Belum Bayar' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedStatusFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      selectedStatusFilter === f.id
                        ? 'bg-[#B86B35] text-white shadow-xs'
                        : 'bg-[#F6ECE1] text-[#622F12] hover:bg-[#EBD8C6]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <Link
                href="/booking"
                className="px-4 py-2 rounded-xl bg-[#B86B35] hover:bg-[#9B5424] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Buat Penitipan Baru</span>
              </Link>
            </div>

            {/* List Booking Cards */}
            {bookingsLoading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-3 border-[#B86B35] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs font-bold text-[#705E54]">Memuat riwayat penitipan Anda...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EBD8C6]">
                <div className="w-16 h-16 rounded-2xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[32px]">inventory</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#2A1B14] mb-1">Belum Ada Riwayat Penitipan</h3>
                <p className="text-xs text-[#705E54] max-w-sm mx-auto mb-6">
                  Anda belum memiliki riwayat penitipan barang kos untuk filter ini. Mulai titip barang Anda dengan aman sekarang!
                </p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#B86B35] hover:bg-[#9B5424] text-white font-bold text-xs transition-all shadow-md shadow-[#B86B35]/20"
                >
                  <span className="material-symbols-outlined text-[16px]">add_box</span>
                  <span>Mulai Booking Penitipan</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => {
                  const isUnpaid = b.paymentStatus !== 'PAID';
                  const isPayable = isUnpaid && b.status !== 'CANCELLED';

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-3xl p-6 border border-[#EBD8C6] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E8DDD3] gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center font-extrabold text-sm shrink-0">
                            {b.kategori}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#2A1B14] text-base">{b.kodeBooking}</span>
                              {getStatusBadge(b.status)}
                              {getPaymentStatusBadge(b.paymentStatus)}
                            </div>
                            <p className="text-xs text-[#705E54] mt-0.5">
                              Dibuat pada {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-[#705E54]">Total Tagihan</p>
                          <p className="text-lg font-extrabold text-[#B86B35]">
                            {formatRupiah(b.totalHarga)}
                          </p>
                        </div>
                      </div>

                      {/* Detail Barang & Jadwal */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 text-xs">
                        <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBD8C6]/50">
                          <span className="text-[#705E54] block font-semibold mb-1">Penjemputan:</span>
                          <span className="font-extrabold text-[#2A1B14]">
                            {b.tanggalPickup
                              ? new Date(b.tanggalPickup).toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })
                              : 'Menunggu penentuan jadwal'}
                          </span>
                        </div>

                        <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBD8C6]/50">
                          <span className="text-[#705E54] block font-semibold mb-1">Durasi Penitipan:</span>
                          <span className="font-extrabold text-[#2A1B14]">{b.durasiBulan} Bulan</span>
                        </div>

                        <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#EBD8C6]/50">
                          <span className="text-[#705E54] block font-semibold mb-1">Jumlah Barang:</span>
                          <span className="font-extrabold text-[#2A1B14]">
                            {b.items?.reduce((acc, it) => acc + (it.jumlah || 1), 0) || 0} Barang Terdata
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions Card */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="text-xs text-[#705E54] truncate max-w-md">
                          <span className="font-bold text-[#421E0B]">Lokasi: </span>
                          <span>{b.lokasiPickup || 'Alamat tidak dicantumkan'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBookingDetail(b)}
                            className="px-4 py-2 rounded-xl bg-[#F6ECE1] hover:bg-[#EBD8C6] text-[#622F12] font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>Detail Tracking</span>
                          </button>

                          {isPayable && (
                            <button
                              type="button"
                              disabled={paymentLoadingId === b.id}
                              onClick={() => handlePayBooking(b)}
                              className="px-4 py-2 rounded-xl bg-[#B86B35] hover:bg-[#9B5424] text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {paymentLoadingId === b.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <span className="material-symbols-outlined text-[16px]">payment</span>
                              )}
                              <span>Bayar via Midtrans</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: KEAMANAN & SOP GUDANG */}
        {activeTab === 'keamanan' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBD8C6] shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-[#E8DDD3]">
              <div className="w-10 h-10 rounded-xl bg-[#F6ECE1] text-[#B86B35] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">security</span>
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#2A1B14]">Protokol Keamanan & Jaminan Kosinaja</h2>
                <p className="text-xs text-[#705E54]">Standar operasional ketat untuk melindungi barang kesayangan mahasiswa Padang.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EBD8C6]/80 space-y-2">
                <div className="flex items-center gap-2 text-[#B86B35] font-extrabold text-sm">
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                  <span>CCTV 24 Jam & Gudang Tertutup</span>
                </div>
                <p className="text-xs text-[#705E54] leading-relaxed">
                  Gudang penyimpanan kami dilengkapi kamera pengawas resolusi tinggi dan akses terbatas hanya untuk staf gudang berwenang.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EBD8C6]/80 space-y-2">
                <div className="flex items-center gap-2 text-[#B86B35] font-extrabold text-sm">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span>Wrapping Bubble Wrap & Dus Tebal</span>
                </div>
                <p className="text-xs text-[#705E54] leading-relaxed">
                  Setiap barang dilapisi plastik wrapping kedap debu dan kelembapan, serta ditempatkan di atas palet kayu kokoh.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EBD8C6]/80 space-y-2">
                <div className="flex items-center gap-2 text-[#B86B35] font-extrabold text-sm">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  <span>Laporan Kondisi Digital (Condition Report)</span>
                </div>
                <p className="text-xs text-[#705E54] leading-relaxed">
                  Kurir melakukan foto kondisi fisik barang saat penjemputan di kos dan mengunggahnya ke sistem sebelum disimpan.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EBD8C6]/80 space-y-2">
                <div className="flex items-center gap-2 text-[#B86B35] font-extrabold text-sm">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                  <span>Surat Perjanjian Bermaterai Digital</span>
                </div>
                <p className="text-xs text-[#705E54] leading-relaxed">
                  Penitipan berjangka panjang dilindungi klausul perjanjian tertulis resmi demi ketenangan mahasiswa dan orang tua.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8DDD3] flex items-center justify-between">
              <span className="text-xs text-[#705E54]">Sesi masuk aktif dari perangkat ini.</span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Keluar dari Sesi Ini</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL DETAIL BOOKING */}
        {selectedBookingDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#EBD8C6] shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DDD3]">
                <div>
                  <h3 className="text-lg font-extrabold text-[#2A1B14]">
                    Detail Penitipan {selectedBookingDetail.kodeBooking}
                  </h3>
                  <p className="text-xs text-[#705E54]">
                    Status: {selectedBookingDetail.status} • Kategori {selectedBookingDetail.kategori}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetail(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
              </div>

              {/* Rincian Barang */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#705E54] mb-3">
                  Barang yang Dititipkan ({selectedBookingDetail.items?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedBookingDetail.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#EBD8C6]/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#B86B35] text-[18px]">package_2</span>
                        <span className="font-bold text-[#2A1B14]">{item.namaBarang}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-white font-extrabold text-[#B86B35] border border-[#EBD8C6]">
                        {item.jumlah} Unit
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condition Report */}
              {selectedBookingDetail.conditionReport && (
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#705E54] mb-3">
                    Laporan Kondisi Barang (Condition Report)
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <p className="font-semibold text-slate-700">
                      PIC Kurir: <span className="font-bold">{selectedBookingDetail.conditionReport.picKurir || 'Petugas Kosinaja'}</span>
                    </p>
                    {selectedBookingDetail.conditionReport.fotoBefore && (
                      <div>
                        <span className="text-[11px] text-slate-500 block mb-1">Foto Sebelum Wrapping:</span>
                        <img
                          src={selectedBookingDetail.conditionReport.fotoBefore}
                          alt="Foto Before"
                          className="w-full max-h-48 object-cover rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Info Pembayaran */}
              <div className="p-4 rounded-2xl bg-[#F6ECE1] border border-[#EBD8C6] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#705E54]">Status Pembayaran</p>
                  <div className="mt-1">{getPaymentStatusBadge(selectedBookingDetail.paymentStatus)}</div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#705E54]">Total Tagihan</p>
                  <p className="text-base font-extrabold text-[#B86B35]">
                    {formatRupiah(selectedBookingDetail.totalHarga)}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
