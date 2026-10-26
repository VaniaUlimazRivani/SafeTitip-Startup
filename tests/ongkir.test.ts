import {
  hitungTarifDasarOngkir,
  kalkulasiOngkirLengkap,
  KOSINAJA_WAREHOUSE,
} from '../lib/services/ongkirService';

describe('Ongkir & Maps Service Calculation Tests', () => {
  test('Jarak <= 1km harus GRATIS (Rp 0)', () => {
    expect(hitungTarifDasarOngkir(0.5)).toBe(0);
    expect(hitungTarifDasarOngkir(1.0)).toBe(0);
  });

  test('Tarif jarak sesuai tabel yang diminta pengguna', () => {
    expect(hitungTarifDasarOngkir(2.0)).toBe(5000);
    expect(hitungTarifDasarOngkir(2.5)).toBe(7000);
    expect(hitungTarifDasarOngkir(3.5)).toBe(8000);
    expect(hitungTarifDasarOngkir(4.3)).toBe(9000);
    expect(hitungTarifDasarOngkir(4.8)).toBe(10000);
    expect(hitungTarifDasarOngkir(5.2)).toBe(11000);
    expect(hitungTarifDasarOngkir(5.8)).toBe(12000);
    expect(hitungTarifDasarOngkir(6.3)).toBe(13000);
    expect(hitungTarifDasarOngkir(6.8)).toBe(14000);
    expect(hitungTarifDasarOngkir(7.3)).toBe(15000);
    expect(hitungTarifDasarOngkir(7.8)).toBe(16000);
    expect(hitungTarifDasarOngkir(8.3)).toBe(17000);
    expect(hitungTarifDasarOngkir(8.8)).toBe(18000);
    expect(hitungTarifDasarOngkir(9.3)).toBe(19000);
    expect(hitungTarifDasarOngkir(9.8)).toBe(20000);
    expect(hitungTarifDasarOngkir(11.0)).toBe(24000);
    expect(hitungTarifDasarOngkir(12.0)).toBe(26000);
    expect(hitungTarifDasarOngkir(15.0)).toBe(32000);
    expect(hitungTarifDasarOngkir(20.0)).toBe(43000);
    expect(hitungTarifDasarOngkir(25.0)).toBe(55000);
  });

  test('Paket Kategori B mendapatkan surcharge penanganan +Rp 3.000 jika > 1km', () => {
    const coordUNP = { lat: -0.8970, lng: 100.3520 }; // UNP Air Tawar (~10-11km)
    const resultA = kalkulasiOngkirLengkap(coordUNP, 'A', 'PICKUP', 'DELIVERY');
    const resultB = kalkulasiOngkirLengkap(coordUNP, 'B', 'PICKUP', 'DELIVERY');

    expect(resultB.surchargeKategori).toBe(3000);
    expect(resultB.ongkirPerTrip).toBe(resultA.ongkirPerTrip + 3000);
  });

  test('Pengguna bisa memilih Antar Sendiri / Ambil Sendiri sehingga ongkir jadi Rp 0', () => {
    const coord = { lat: -0.9620, lng: 100.3950 };
    const resultSelf = kalkulasiOngkirLengkap(coord, 'A', 'SELF_DROPOFF', 'SELF_PICKUP');

    expect(resultSelf.ongkirPickup).toBe(0);
    expect(resultSelf.ongkirDelivery).toBe(0);
    expect(resultSelf.totalOngkir).toBe(0);
  });
});
