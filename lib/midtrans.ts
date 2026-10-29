import crypto from 'crypto';
// @ts-ignore
import midtransClient from 'midtrans-client';

export const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
export const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder';
export const clientKey = process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder';

// Inisialisasi Snap Client
export const snap = new midtransClient.Snap({
  isProduction: isProduction,
  serverKey: serverKey,
  clientKey: clientKey,
});

// Inisialisasi Core API Client (jika sewaktu-waktu dibutuhkan)
export const coreApi = new midtransClient.CoreApi({
  isProduction: isProduction,
  serverKey: serverKey,
  clientKey: clientKey,
});

/**
 * Validasi signature_key dari webhook Midtrans
 * Format SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  if (!signatureKey) return false;
  const rawString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const computedHash = crypto.createHash('sha512').update(rawString).digest('hex');
  return computedHash.toLowerCase() === signatureKey.toLowerCase();
}
