'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationPicker from '@/components/LocationPicker';

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
  const [activeTab, setActiveTab] = useState<'profil' | 'riwayat' | 'titipan' | 'alamat' | 'keamanan'>('profil');

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

  // State Modal Edit Profil & Ganti Sandi
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Deteksi Perubahan Data Form (Dirty check)
  const isProfileDirty = Boolean(
    (currentUser && (
      formData.nama.trim() !== (currentUser.nama || '').trim() ||
      formData.noWa.trim() !== (currentUser.noWa || '').trim() ||
      formData.alamat.trim() !== (currentUser.alamat || '').trim()
    )) ||
    passwordForm.newPassword.length > 0
  );

  const isAlamatDirty = Boolean(
    currentUser && formData.alamat.trim() !== (currentUser.alamat || '').trim()
  );

  // Auto-dismiss notifikasi toast setelah 5 detik
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

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
    setModalFeedback(null);

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
      setFeedback({
        type: 'success',
        message: isEditModalOpen ? 'Profil akun Anda berhasil diperbarui!' : 'Alamat kos penjemputan berhasil diperbarui!',
      });
      setIsEditModalOpen(false);
      setIsChangePasswordOpen(false);
    } catch (err: any) {
      const errMsg = err.message || 'Terjadi kesalahan sistem.';
      setFeedback({ type: 'error', message: errMsg });
      setModalFeedback({ type: 'error', message: errMsg });
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
        return <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-amber-100 text-amber-800 font-bold border border-amber-200">Menunggu Konfirmasi</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-blue-100 text-blue-800 font-bold border border-blue-200">Disetujui Admin</span>;
      case 'PICKUP_SCHEDULED':
        return <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-violet-100 text-violet-800 font-bold border border-violet-200">Jadwal Penjemputan</span>;
      case 'IN_STORAGE':
        return <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">Di Gudang Aman</span>;
      case 'DELIVERED':
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-teal-100 text-teal-800 font-bold border border-teal-200">Selesai / Terkirim</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-rose-100 text-rose-700 font-bold border border-rose-200">Dibatalkan</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-surface-container-high text-on-surface font-bold">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    if (paymentStatus === 'PAID') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          Lunas
        </span>
      );
    }
    if (paymentStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-amber-100 text-amber-800 font-bold border border-amber-200">
          <span className="material-symbols-outlined text-[14px]">pending</span>
          Menunggu Pembayaran
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-rose-100 text-rose-700 font-bold border border-rose-200">
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

  // Booking aktif pertama (untuk preview di tab profil)
  const activeBooking = bookings.find((b) =>
    ['LEAD', 'APPROVED', 'PICKUP_SCHEDULED', 'IN_STORAGE'].includes(b.status)
  );

  // Tampilan Belum Login
  if (isSessionLoaded && !currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl p-8 shadow-xl text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-lg mb-6">
              <span className="material-symbols-outlined text-[40px]">person_off</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Akses Akun Kosinaja</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-8">
              Silakan masuk ke akun Anda terlebih dahulu untuk melihat informasi profil pribadi dan melacak riwayat penitipan barang kos Anda.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3.5 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Masuk ke Akun</span>
              </Link>
              <Link
                href="/login?mode=register"
                className="w-full py-3.5 px-4 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-all flex items-center justify-center gap-2"
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
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 w-full pt-20">
        <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-8 py-8 space-y-8">

          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">home</span>
                Beranda
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold">Profil Saya &amp; Manajemen Penitipan</span>
            </div>
          </div>

          {/* 1. PROFILE HEADER CARD */}
          <section className="w-full bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden border border-outline-variant">
            {/* Decorative glow */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Left: Avatar + Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar Frame */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-primary p-1 shadow-lg overflow-hidden">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.nama}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-on-primary flex items-center justify-center text-primary text-3xl sm:text-4xl font-extrabold">
                        {currentUser?.nama?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 font-label-sm text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Aktif
                  </div>
                </div>

                {/* User Narrative */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
                      {currentUser?.nama || 'Pengguna SafeTitip'}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                      Member Terverifikasi
                    </span>
                  </div>
                  {/* Quick Pill Attributes */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high font-label-md text-label-md text-on-surface border border-outline-variant">
                      <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                      <span>{currentUser?.email || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high font-label-md text-label-md text-on-surface border border-outline-variant">
                      <span className="material-symbols-outlined text-[16px] text-secondary">chat</span>
                      <span>{currentUser?.noWa || 'Belum ada nomor WA'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high font-label-md text-label-md text-on-surface border border-outline-variant">
                      <span className="material-symbols-outlined text-[16px] text-primary">pin_drop</span>
                      <span>Kota Padang, Sumbar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('profil')}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:opacity-90 shadow-[0_10px_20px_-5px_rgba(153,65,16,0.4)] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  Edit Profil
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('keamanan')}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold hover:bg-surface-container-highest border border-outline-variant transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">lock_reset</span>
                  Pengaturan Keamanan
                </button>
              </div>
            </div>
          </section>

          {/* 2. STATS CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Barang */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Total Barang Dititip</span>
                <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                </div>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-primary font-black">
                  {stats.totalBookings} <span className="font-body-md text-body-md text-on-surface-variant font-normal">Booking</span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                  Semua unit terverifikasi
                </p>
              </div>
            </div>

            {/* Card 2: Titipan Aktif */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Titipan Aktif</span>
                <div className="w-11 h-11 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">warehouse</span>
                </div>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-blue-600 font-black">
                  {stats.activeBookings} <span className="font-body-md text-body-md text-on-surface-variant font-normal">Aktif</span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">pin_drop</span>
                  Gudang Kosinaja, Padang
                </p>
              </div>
            </div>

            {/* Card 3: Booking Selesai */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow border-l-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Booking Selesai</span>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">task_alt</span>
                </div>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-emerald-600 font-black">
                  {stats.completedBookings} <span className="font-body-md text-body-md text-on-surface-variant font-normal">Selesai</span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-emerald-500">school</span>
                  Terkirim ke kos dengan selamat
                </p>
              </div>
            </div>

            {/* Card 4: Payment Gateway */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Payment Gateway</span>
                <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">credit_card</span>
                </div>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-bold">Midtrans Gateway</div>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Terhubung
                </span>
              </div>
            </div>
          </section>

          {/* 3. TWO-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN (8 cols) */}
            <div className="lg:col-span-8 space-y-6">

              {/* Tab Navigation Horizontal Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 p-1.5 bg-surface-container rounded-2xl border border-outline-variant">
                <button
                  onClick={() => setActiveTab('profil')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'profil'
                      ? 'bg-primary text-on-primary shadow-md font-bold'
                      : 'text-on-surface hover:text-primary hover:bg-surface-container-high font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  Informasi Pribadi
                </button>

                <button
                  onClick={() => setActiveTab('titipan')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'titipan'
                      ? 'bg-primary text-on-primary shadow-md font-bold'
                      : 'text-on-surface hover:text-primary hover:bg-surface-container-high font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">box_add</span>
                  Riwayat Titipan
                  {bookings.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold leading-none ${activeTab === 'titipan' ? 'bg-on-primary text-primary' : 'bg-primary text-on-primary'}`}>
                      {bookings.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('alamat')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'alamat'
                      ? 'bg-primary text-on-primary shadow-md font-bold'
                      : 'text-on-surface hover:text-primary hover:bg-surface-container-high font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Daftar Alamat
                </button>

                <button
                  onClick={() => setActiveTab('keamanan')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'keamanan'
                      ? 'bg-primary text-on-primary shadow-md font-bold'
                      : 'text-on-surface hover:text-primary hover:bg-surface-container-high font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                  Keamanan &amp; SOP
                </button>
              </div>

              {/* ===== TAB: INFORMASI PRIBADI (profil) ===== */}
              {activeTab === 'profil' && (
                <div className="space-y-6">
                  {/* Section 1: Ringkasan Data Akun (Tampilan Bersih & Terstruktur) */}
                  <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm space-y-6 border border-outline-variant/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Informasi Akun &amp; Kontak</h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">shield</span> Terlindungi
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Data akun terenkripsi sesuai standar logistik legal Kosinaja Padang</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-all cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit_square</span>
                        <span>Edit Profil</span>
                      </button>
                    </div>

                    {feedback && (
                      <div
                        className={`p-4 rounded-2xl font-label-md text-label-md flex items-center justify-between gap-2.5 ${
                          feedback.type === 'success'
                            ? 'bg-secondary-fixed text-secondary'
                            : 'bg-tertiary-fixed text-tertiary'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[20px]">
                            {feedback.type === 'success' ? 'check_circle' : 'error'}
                          </span>
                          <span>{feedback.message}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFeedback(null)}
                          className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    )}

                    {/* Data Detail Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nama Lengkap */}
                      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-1">
                        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                          <span>Nama Lengkap Sesuai KTP</span>
                          <span className="text-secondary font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">done</span> Valid
                          </span>
                        </div>
                        <div className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                          {formData.nama || '-'}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-1">
                        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                          <span>Alamat Email</span>
                          <span className="text-secondary font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">verified</span> Terverifikasi
                          </span>
                        </div>
                        <div className="font-body-md text-body-md text-on-surface font-semibold truncate pt-1">
                          {formData.email || '-'}
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-1">
                        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                          <span>Nomor WhatsApp Utama</span>
                          <span className="text-primary font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">phone_iphone</span> Penjemputan
                          </span>
                        </div>
                        <div className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                          {formData.noWa || '-'}
                        </div>
                        <p className="text-[11px] text-on-surface-variant">Digunakan kurir untuk konfirmasi penjemputan barang</p>
                      </div>

                      {/* Wilayah Layanan */}
                      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-1">
                        <div className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                          Wilayah Operasional
                        </div>
                        <div className="font-body-md text-body-md text-on-surface font-semibold flex items-center gap-1.5 pt-1">
                          <span className="material-symbols-outlined text-primary text-[18px]">location_city</span>
                          <span>Kota Padang, Sumatera Barat</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant">Hub Pusat: Hotel Ibis Padang</p>
                      </div>

                      {/* Alamat Kos Utama */}
                      <div className="sm:col-span-2 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                            Alamat Kos / Penjemputan Default
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('alamat')}
                            className="text-primary font-label-sm text-label-sm font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                            <span>Atur Titik Pin di Tab Alamat</span>
                            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                          </button>
                        </div>
                        <div className="font-body-md text-body-md text-on-surface font-medium leading-relaxed">
                          {formData.alamat || 'Belum ada alamat yang ditambahkan. Gunakan pin maps di tab Daftar Alamat untuk menentukan lokasi kos Anda.'}
                        </div>
                      </div>
                    </div>

                    {/* Section Ubah Sandi Cepat */}
                    <div className="p-4 rounded-2xl bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-xs">
                          <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                        </div>
                        <div>
                          <div className="font-label-md text-label-md text-on-surface font-bold">Keamanan &amp; Kata Sandi Akun</div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Kata sandi terenkripsi • Terakhir diperbarui</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setIsChangePasswordOpen(true);
                        }}
                        className="px-4 py-2 rounded-full bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Ganti Sandi
                      </button>
                    </div>

                    {/* Notice Callout */}
                    <div className="p-4 rounded-2xl bg-surface-container flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Pastikan nomor WhatsApp aktif dan alamat kos akurat agar tim kurir kami dapat menjemput barang Anda tepat waktu. Kontak darurat hanya dihubungi apabila Anda tidak dapat dikonfirmasi dalam waktu <strong className="text-on-surface">3x24 jam</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Section 2: Active Booking Preview */}
                  {activeBooking && (
                    <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">Titipan Sedang Aktif</span>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span className="font-mono font-label-sm text-label-sm font-semibold text-on-surface">{activeBooking.kodeBooking}</span>
                          </div>
                          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                            Kategori: {activeBooking.kategori}
                          </h3>
                        </div>
                        <div className="shrink-0">{getStatusBadge(activeBooking.status)}</div>
                      </div>

                      {/* Item pills */}
                      {activeBooking.items && activeBooking.items.length > 0 && (
                        <div className="p-4 rounded-2xl bg-surface-container-low space-y-3">
                          <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">inventory</span>
                            Rincian Barang yang Dititip ({activeBooking.items.reduce((acc, it) => acc + (it.jumlah || 1), 0)} Unit)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {activeBooking.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="p-3 bg-surface-container-lowest rounded-xl flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center shrink-0">
                                  <span className="material-symbols-outlined text-[20px]">package_2</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-label-md text-label-md text-on-surface font-bold truncate">{item.namaBarang}</div>
                                  <div className="font-label-sm text-label-sm text-on-surface-variant">{item.jumlah} unit</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveTab('titipan')}
                          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container shadow-[0_10px_20px_-5px_rgba(153,65,16,0.3)] transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                          Jadwalkan Pengantaran
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBookingDetail(activeBooking)}
                          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-surface-container text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== TAB: RIWAYAT TITIPAN (titipan) ===== */}
              {activeTab === 'titipan' && (
                <div className="space-y-5">
                  {/* Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface-variant mr-1">Filter Status:</span>
                      {[
                        { id: 'ALL', label: 'Semua Status' },
                        { id: 'ACTIVE', label: 'Sedang Berjalan' },
                        { id: 'COMPLETED', label: 'Selesai' },
                        { id: 'UNPAID', label: 'Belum Bayar' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedStatusFilter(f.id as any)}
                          className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${
                            selectedStatusFilter === f.id
                              ? 'bg-primary-container text-on-primary-container shadow-sm'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <Link
                      href="/booking"
                      className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Penitipan Baru</span>
                    </Link>
                  </div>

                  {/* Booking List */}
                  {bookingsLoading ? (
                    <div className="py-20 text-center">
                      <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="font-label-md text-label-md text-on-surface-variant">Memuat riwayat penitipan Anda...</p>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-sm">
                      <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-[32px]">inventory</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Belum Ada Riwayat Penitipan</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto mb-6">
                        Anda belum memiliki riwayat penitipan barang kos untuk filter ini. Mulai titip barang Anda dengan aman sekarang!
                      </p>
                      <Link
                        href="/booking"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-md"
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
                            className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-outline-variant gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center font-extrabold font-label-lg text-label-lg shrink-0 shadow-sm">
                                  {b.kategori?.charAt(0) || 'B'}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-label-lg text-label-lg font-bold text-on-surface">{b.kodeBooking}</span>
                                    {getStatusBadge(b.status)}
                                    {getPaymentStatusBadge(b.paymentStatus)}
                                  </div>
                                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                                    Dibuat pada {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                </div>
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="font-label-sm text-label-sm text-on-surface-variant">Total Tagihan</p>
                                <p className="font-headline-sm text-headline-sm font-bold text-primary">
                                  {formatRupiah(b.totalHarga)}
                                </p>
                              </div>
                            </div>

                            {/* Detail Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant">
                                <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Penjemputan:</span>
                                <span className="font-label-md text-label-md font-bold text-on-surface">
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
                              <div className="bg-surface-container p-3 rounded-xl">
                                <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Durasi Penitipan:</span>
                                <span className="font-label-md text-label-md font-bold text-on-surface">{b.durasiBulan} Bulan</span>
                              </div>
                              <div className="bg-surface-container p-3 rounded-xl">
                                <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Jumlah Barang:</span>
                                <span className="font-label-md text-label-md font-bold text-on-surface">
                                  {b.items?.reduce((acc, it) => acc + (it.jumlah || 1), 0) || 0} Barang Terdata
                                </span>
                              </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-md">
                                <span className="font-semibold text-on-surface">Lokasi: </span>
                                <span>{b.lokasiPickup || 'Alamat tidak dicantumkan'}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedBookingDetail(b)}
                                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5"
                                >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                                  <span>Detail Tracking</span>
                                </button>

                                {isPayable && (
                                  <button
                                    type="button"
                                    disabled={paymentLoadingId === b.id}
                                    onClick={() => handlePayBooking(b)}
                                    className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                                  >
                                    {paymentLoadingId === b.id ? (
                                      <div className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
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

              {/* ===== TAB: DAFTAR ALAMAT (alamat) ===== */}
              {activeTab === 'alamat' && (
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
                  <div className="space-y-1">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[24px]">pin_drop</span>
                      Kelola Alamat Kos &amp; Titik Penjemputan
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Atur titik lokasi kos atau tempat tinggal Anda di wilayah Kota Padang menggunakan Pin Maps interaktif (sama seperti form booking) untuk memudahkan tim kurir Kosinaja menjemput barang Anda.
                    </p>
                  </div>

                  {/* Alamat Card Preview Saat Ini */}
                  <div className="p-4 rounded-2xl bg-surface-container space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">home_pin</span>
                        Alamat Kos Utama Saat Ini
                      </span>
                      <span className="px-2.5 py-0.5 bg-primary text-on-primary font-label-sm text-label-sm rounded-full font-bold">Default</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface font-medium leading-relaxed">
                      {formData.alamat || 'Belum ada alamat yang ditambahkan. Silakan gunakan pin maps di bawah untuk menentukan alamat kos Anda.'}
                    </p>
                  </div>

                  {feedback && (
                    <div
                      className={`p-4 rounded-2xl font-label-md text-label-md flex items-center gap-2.5 ${
                        feedback.type === 'success'
                          ? 'bg-secondary-fixed text-secondary'
                          : 'bg-tertiary-fixed text-tertiary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {feedback.type === 'success' ? 'check_circle' : 'error'}
                      </span>
                      <span>{feedback.message}</span>
                    </div>
                  )}

                  {/* Form Penetapan Alamat dengan Pin Maps Sesuai Form Booking */}
                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <LocationPicker
                      mode="profile"
                      initialAlamat={formData.alamat}
                      mapTitle="Peta Penjemputan Kos (Kota Padang)"
                      mapSubtitle="Geser pin merah ke lokasi kos Anda, cari kampus/jalan terdekat, atau klik 'Gunakan Lokasi Saya'"
                      onChangeOngkir={(res) => {
                        setFormData((prev) => ({ ...prev, alamat: res.alamatDetail }));
                      }}
                    />

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-outline-variant">
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[16px]">info</span>
                        <span>Alamat ini otomatis disinkronkan saat Anda membuka formulir booking penitipan.</span>
                      </p>
                      <button
                        type="submit"
                        disabled={updateLoading || !isAlamatDirty}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        {updateLoading ? (
                          <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : !isAlamatDirty ? (
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        ) : null}
                        <span>{isAlamatDirty ? 'Simpan Alamat Kos' : 'Alamat Sudah Tersimpan'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ===== TAB: KEAMANAN (keamanan) ===== */}
              {activeTab === 'keamanan' && (
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-5 border-b border-outline-variant">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">security</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Protokol Keamanan &amp; Jaminan Kosinaja</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Standar operasional ketat untuk melindungi barang kesayangan mahasiswa Padang.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-5 rounded-2xl bg-surface-container-low space-y-2">
                      <div className="flex items-center gap-2 text-primary font-label-lg text-label-lg font-bold">
                        <span className="material-symbols-outlined text-[20px]">videocam</span>
                        <span>CCTV 24 Jam &amp; Gudang Tertutup</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Gudang penyimpanan kami dilengkapi kamera pengawas resolusi tinggi dan akses terbatas hanya untuk staf gudang berwenang.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-surface-container-low space-y-2">
                      <div className="flex items-center gap-2 text-primary font-label-lg text-label-lg font-bold">
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                        <span>Wrapping Bubble Wrap &amp; Dus Tebal</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Setiap barang dilapisi plastik wrapping kedap debu dan kelembapan, serta ditempatkan di atas palet kayu kokoh.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-surface-container-low space-y-2">
                      <div className="flex items-center gap-2 text-primary font-label-lg text-label-lg font-bold">
                        <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                        <span>Laporan Kondisi Digital</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Kurir melakukan foto kondisi fisik barang saat penjemputan di kos dan mengunggahnya ke sistem sebelum disimpan.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-surface-container-low space-y-2">
                      <div className="flex items-center gap-2 text-primary font-label-lg text-label-lg font-bold">
                        <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                        <span>Surat Perjanjian Bermaterai Digital</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Penitipan berjangka panjang dilindungi klausul perjanjian tertulis resmi demi ketenangan mahasiswa dan orang tua.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Sesi masuk aktif dari perangkat ini.</span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-full bg-tertiary-fixed text-tertiary hover:bg-tertiary-fixed-dim font-label-md text-label-md transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Keluar dari Sesi Ini</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN (4 cols) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Card 1: Alamat Utama Kos */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-5 border border-outline-variant">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">home_pin</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Alamat Utama Kos</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">Prioritas</span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low space-y-3">
                  <div>
                    <div className="font-label-lg text-label-lg font-bold text-on-surface">Alamat Penjemputan</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      {formData.alamat || 'Belum ada alamat yang ditambahkan. Silakan tentukan pin lokasi di tab Daftar Alamat.'}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('alamat')}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary/90 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">pin_drop</span>
                    <span>Ubah Pin Alamat di Peta</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Jaminan & Garansi */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-5 border border-outline-variant">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Jaminan &amp; Garansi</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md font-bold text-on-surface">Asuransi s/d Rp 10.000.000</div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Proteksi risiko kebakaran, kebocoran, dan kehilangan per pesanan.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">hvac</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md font-bold text-on-surface">Gudang Kering &amp; Bebas Lembap</div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Suhu dan sirkulasi dipantau 24/7 untuk melindungi buku &amp; elektronik.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md font-bold text-on-surface">Segel Barcode Berlapis</div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Setiap box disegel di depan mata pelanggan saat serah terima di kos.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container text-center">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">SOP Berstandar Logistik Aman Kosinaja</span>
                </div>
              </div>

              {/* Card 3: Bantuan Cepat */}
              <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4 border border-outline-variant">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-tertiary flex items-center justify-center text-on-tertiary shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">support_agent</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Bantuan Cepat</h3>
                  </div>
                  <span className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    Online
                  </span>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Butuh penjemputan darurat sebelum jadwal kereta/pesawat? Hubungi PIC Wilayah Padang:
                </p>

                <div className="p-4 rounded-2xl bg-surface-container space-y-2">
                  <div className="font-label-sm text-label-sm text-on-surface-variant">WhatsApp CS Wilayah Padang:</div>
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">+62 821-3456-7890</span>
                    <a
                      href="https://wa.me/6282134567890"
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Jam Operasional: 08.00 - 21.00 WIB</span>
                  </div>
                </div>

                <a
                  href="#"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant hover:border-primary text-on-surface hover:text-primary font-label-md text-label-md font-semibold shadow-2xs hover:bg-surface-container-low transition-all active:scale-[0.98] text-center"
                >
                  <span className="material-symbols-outlined text-[19px] text-primary">help_center</span>
                  <span>Pusat Panduan &amp; FAQ Mahasiswa</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* MODAL DETAIL BOOKING */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Detail Penitipan {selectedBookingDetail.kodeBooking}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Status: {selectedBookingDetail.status} • Kategori {selectedBookingDetail.kategori}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingDetail(null)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Rincian Barang */}
            <div>
              <h4 className="font-label-md text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                Barang yang Dititipkan ({selectedBookingDetail.items?.length || 0})
              </h4>
              <div className="space-y-2">
                {selectedBookingDetail.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">package_2</span>
                      <span className="font-label-md text-label-md font-bold text-on-surface">{item.namaBarang}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">
                      {item.jumlah} Unit
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Condition Report */}
            {selectedBookingDetail.conditionReport && (
              <div>
                <h4 className="font-label-md text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                  Laporan Kondisi Barang (Condition Report)
                </h4>
                <div className="p-4 rounded-2xl bg-surface-container-low space-y-2">
                  <p className="font-label-md text-label-md text-on-surface">
                    PIC Kurir: <span className="font-bold">{selectedBookingDetail.conditionReport.picKurir || 'Petugas Kosinaja'}</span>
                  </p>
                  {selectedBookingDetail.conditionReport.fotoBefore && (
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Foto Sebelum Wrapping:</span>
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
            <div className="p-4 rounded-2xl bg-surface-container flex items-center justify-between">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Status Pembayaran</p>
                <div className="mt-1">{getPaymentStatusBadge(selectedBookingDetail.paymentStatus)}</div>
              </div>
              <div className="text-right">
                <p className="font-label-sm text-label-sm text-on-surface-variant">Total Tagihan</p>
                <p className="font-headline-sm text-headline-sm font-bold text-primary">
                  {formatRupiah(selectedBookingDetail.totalHarga)}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBookingDetail(null)}
                className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL EDIT PROFIL & KATA SANDI ===== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-outline-variant my-8 space-y-6 animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-outline-variant pb-4">
              <div className="space-y-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">manage_accounts</span>
                  <span>Edit Profil Akun</span>
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Perbarui data kontak dan kata sandi akun Kosinaja Anda
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setModalFeedback(null);
                }}
                className="p-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {modalFeedback && (
                <div
                  className={`p-3.5 rounded-2xl font-label-md text-label-md flex items-center gap-2.5 ${
                    modalFeedback.type === 'success'
                      ? 'bg-secondary-fixed text-secondary'
                      : 'bg-tertiary-fixed text-tertiary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {modalFeedback.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{modalFeedback.message}</span>
                </div>
              )}

              {/* Nama Lengkap */}
              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
                  Nama Lengkap <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-on-surface font-body-md text-body-md"
                  placeholder="Nama lengkap sesuai KTP"
                />
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
                  Email Akun <span className="text-on-surface-variant text-[11px] font-normal">(Tidak dapat diubah)</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant font-body-md text-body-md cursor-not-allowed opacity-80"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
                  Nomor WhatsApp <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-[13px]">
                    +62
                  </span>
                  <input
                    type="tel"
                    required
                    value={
                      formData.noWa.startsWith('62')
                        ? formData.noWa.slice(2)
                        : formData.noWa.startsWith('0')
                        ? formData.noWa.slice(1)
                        : formData.noWa
                    }
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setFormData((prev) => ({ ...prev, noWa: val ? `62${val}` : '' }));
                    }}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-on-surface font-body-md text-body-md"
                    placeholder="8123456789"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Nomor aktif untuk konfirmasi penjemputan oleh kurir Kosinaja.
                </p>
              </div>

              {/* Catatan Kos / Alamat Singkat */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    Detail Kamar / Catatan Kos
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setActiveTab('alamat');
                    }}
                    className="text-primary text-[12px] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                    <span>Ubah Titik Pin di Tab Alamat</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alamat: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-on-surface font-body-md text-body-md resize-none"
                  placeholder="Contoh: Kos Melati No. 12, Lantai 2, Kamar B3"
                />
              </div>

              {/* Accordion Ganti Kata Sandi */}
              <div className="pt-2 border-t border-outline-variant/60">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(!isChangePasswordOpen)}
                  className="w-full flex items-center justify-between py-2 text-left font-label-md text-label-md font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">lock_reset</span>
                    <span>Ganti Kata Sandi (Opsional)</span>
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px] transition-transform duration-200"
                    style={{ transform: isChangePasswordOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    keyboard_arrow_down
                  </span>
                </button>

                {isChangePasswordOpen && (
                  <div className="mt-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
                    <div>
                      <label className="block text-[12px] font-bold text-on-surface-variant mb-1">
                        Kata Sandi Saat Ini
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant focus:border-primary focus:outline-none text-on-surface text-[13px]"
                        placeholder="Masukkan kata sandi lama Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-on-surface-variant mb-1">
                        Kata Sandi Baru
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant focus:border-primary focus:outline-none text-on-surface text-[13px]"
                        placeholder="Minimal 6 karakter"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-on-surface-variant mb-1">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant focus:border-primary focus:outline-none text-on-surface text-[13px]"
                        placeholder="Ulangi kata sandi baru"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="showPasswordModal"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="showPasswordModal" className="text-[12px] text-on-surface-variant cursor-pointer select-none">
                        Tampilkan karakter kata sandi
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setModalFeedback(null);
                  }}
                  className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updateLoading || !isProfileDirty}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-label-md text-label-md font-bold transition-all shadow-sm ${
                    isProfileDirty
                      ? 'bg-primary text-on-primary hover:bg-primary-container cursor-pointer'
                      : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-60'
                  }`}
                >
                  {updateLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      <span>Menyimpan...</span>
                    </>
                  ) : !isProfileDirty ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      <span>Tidak Ada Perubahan</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
