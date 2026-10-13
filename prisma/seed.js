const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai proses seeding database MongoDB Atlas...');

  // 1. Data Admin & Petugas Operasional
  const adminUsers = [
    {
      nama: 'Vania (Super Admin)',
      email: 'admin@safetitip.com',
      password: 'admin123',
      role: 'ADMIN',
      noWa: '081211112222',
    },
    {
      nama: 'Bambang (Petugas Gudang)',
      email: 'gudang@safetitip.com',
      password: 'gudang123',
      role: 'GUDANG',
      noWa: '081233334444',
    },
    {
      nama: 'Rahmat (Kurir Penjemputan)',
      email: 'kurir@safetitip.com',
      password: 'kurir123',
      role: 'KURIR',
      noWa: '081255556666',
    },
  ];

  console.log('👤 Melakukan seeding AdminUser...');
  for (const admin of adminUsers) {
    const existing = await prisma.adminUser.findUnique({
      where: { email: admin.email },
    });

    if (!existing) {
      const created = await prisma.adminUser.create({ data: admin });
      console.log(`   ✅ Dibuat: ${created.nama} (${created.email}) [${created.role}]`);
    } else {
      console.log(`   ℹ️ Sudah ada: ${existing.nama} (${existing.email})`);
    }
  }

  // 2. Data Mahasiswa Demo Awal (sesuai tombol demo di halaman login)
  const studentUsers = [
    {
      nama: 'Budi Santoso',
      email: 'budi@student.unand.ac.id',
      password: 'password123',
      noWa: '081234567890',
      alamat: 'Kos Putra Andalas, Limau Manis, Padang',
    },
    {
      nama: 'Rina Permata',
      email: 'rina@student.unp.ac.id',
      password: 'password123',
      noWa: '081298765432',
      alamat: 'Wisma Melati, Air Tawar, Padang',
    },
    {
      nama: 'Fajar Pratama',
      email: 'fajar@student.upiyptk.ac.id',
      password: 'password123',
      noWa: '082165432109',
      alamat: 'Kos Rafflesia, Lubuk Begalung, Padang',
    },
  ];

  console.log('\n🎓 Melakukan seeding Mahasiswa Demo (User)...');
  for (const student of studentUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: student.email },
    });

    if (!existing) {
      const created = await prisma.user.create({ data: student });
      console.log(`   ✅ Dibuat: ${created.nama} (${created.email})`);
    } else {
      console.log(`   ℹ️ Sudah ada: ${existing.nama} (${existing.email})`);
    }
  }

  console.log('\n✨ Seeding selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
