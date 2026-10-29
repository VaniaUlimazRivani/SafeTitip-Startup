/**
 * Xendit Payment Gateway Client & Helper
 * Dokumentasi API: https://developers.xendit.co/api-reference/
 */

export const xenditSecretKey = process.env.XENDIT_SECRET_KEY || 'xnd_development_placeholder_key';
export const xenditPublicKey = process.env.XENDIT_PUBLIC_KEY || 'xnd_public_development_placeholder_key';
export const xenditWebhookToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN || '';

export interface CreateInvoiceParams {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  customer?: {
    given_names?: string;
    email?: string;
    mobile_number?: string;
    addresses?: Array<{
      street_line1?: string;
      city?: string;
      country?: string;
    }>;
  };
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    category?: string;
  }>;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  invoiceDuration?: number; // dalam detik (default 86400 = 24 jam)
}

export interface XenditInvoiceResponse {
  id: string;
  external_id: string;
  user_id?: string;
  status: 'PENDING' | 'PAID' | 'SETTLED' | 'EXPIRED';
  merchant_name?: string;
  merchant_profile_picture_url?: string;
  amount: number;
  payer_email?: string;
  description?: string;
  expiry_date?: string;
  invoice_url: string;
  currency?: string;
  created?: string;
  updated?: string;
  payment_method?: string;
  payment_channel?: string;
  payment_destination?: string;
}

/**
 * Membuat Invoice Xendit Baru (Mendukung QRIS, Virtual Account, E-Wallet, Kartu Kredit, Alfamart/Indomaret)
 */
export async function createXenditInvoice(
  params: CreateInvoiceParams
): Promise<XenditInvoiceResponse> {
  const isMockMode =
    !xenditSecretKey ||
    xenditSecretKey.includes('placeholder') ||
    xenditSecretKey.includes('demo');

  // Mode Simulasi / Mock jika belum ada secret key Xendit asli
  if (isMockMode) {
    console.warn(
      '[Xendit] Menggunakan mode simulasi / mock invoice karena XENDIT_SECRET_KEY belum diisi kunci riil.'
    );
    const mockId = `mock_inv_${params.externalId}_${Date.now()}`;
    return {
      id: mockId,
      external_id: params.externalId,
      status: 'PENDING',
      merchant_name: 'KosinAja SafeTitip',
      amount: params.amount,
      payer_email: params.payerEmail,
      description: params.description,
      invoice_url: `https://checkout-staging.xendit.co/web/${mockId}`,
      expiry_date: new Date(Date.now() + 86400 * 1000).toISOString(),
    };
  }

  const basicAuth = Buffer.from(`${xenditSecretKey}:`).toString('base64');

  const response = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify({
      external_id: params.externalId,
      amount: params.amount,
      payer_email: params.payerEmail || 'customer@kosinaja.id',
      description: params.description,
      customer: params.customer,
      items: params.items,
      invoice_duration: params.invoiceDuration || 86400, // 24 jam
      success_redirect_url:
        params.successRedirectUrl ||
        (process.env.NEXT_PUBLIC_BASE_URL
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/profile`
          : 'https://www.kosinaja.id/profile'),
      failure_redirect_url:
        params.failureRedirectUrl ||
        (process.env.NEXT_PUBLIC_BASE_URL
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/profile`
          : 'https://www.kosinaja.id/profile'),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error_code || `Gagal membuat invoice Xendit (Status: ${response.status})`
    );
  }

  return data as XenditInvoiceResponse;
}

/**
 * Mengambil detail status invoice Xendit berdasarkan invoiceId
 */
export async function getXenditInvoice(invoiceId: string): Promise<XenditInvoiceResponse> {
  const isMockMode =
    !xenditSecretKey ||
    xenditSecretKey.includes('placeholder') ||
    xenditSecretKey.includes('demo');

  if (isMockMode) {
    return {
      id: invoiceId,
      external_id: `ext_${invoiceId}`,
      status: 'PENDING',
      amount: 150000,
      invoice_url: `https://checkout-staging.xendit.co/web/${invoiceId}`,
    };
  }

  const basicAuth = Buffer.from(`${xenditSecretKey}:`).toString('base64');
  const response = await fetch(`https://api.xendit.co/v2/invoices/${invoiceId}`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${basicAuth}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil detail invoice Xendit');
  }

  return data as XenditInvoiceResponse;
}

/**
 * Memvalidasi Webhook Callback Token dari Header Xendit
 */
export function verifyXenditWebhook(callbackTokenHeader: string | null): boolean {
  if (!xenditWebhookToken) {
    // Jika webhook token belum diset di .env, loloskan untuk kemudahan development
    return true;
  }
  return callbackTokenHeader === xenditWebhookToken;
}

