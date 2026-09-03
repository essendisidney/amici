import { hasDarajaKeys } from '@/lib/mpesa/store'

function baseUrl() {
  return process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
}

function timestamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

export async function darajaToken() {
  if (!hasDarajaKeys()) return null
  const raw = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
  const res = await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${raw}` },
  })
  if (!res.ok) throw new Error(`Daraja token failed (${res.status})`)
  const json = (await res.json()) as { access_token?: string }
  return json.access_token ?? null
}

export async function stkPush(input: { msisdn: string; amountKes: number; account: string; desc: string }) {
  const token = await darajaToken()
  if (!token) return { demo: true as const, checkoutRequestId: null }

  const ts = timestamp()
  const shortcode = process.env.MPESA_SHORTCODE!
  const password = Buffer.from(`${shortcode}${process.env.MPESA_PASSKEY}${ts}`).toString('base64')
  const callback =
    process.env.MPESA_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/mpesa/callback`

  const res = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline',
      Amount: input.amountKes,
      PartyA: input.msisdn,
      PartyB: shortcode,
      PhoneNumber: input.msisdn,
      CallBackURL: callback,
      AccountReference: input.account.slice(0, 12),
      TransactionDesc: input.desc.slice(0, 13),
    }),
  })

  const json = (await res.json()) as { CheckoutRequestID?: string; errorMessage?: string; ResponseCode?: string }
  if (!res.ok || json.ResponseCode !== '0') {
    throw new Error(json.errorMessage || 'STK push was refused')
  }
  return { demo: false as const, checkoutRequestId: json.CheckoutRequestID ?? null }
}
