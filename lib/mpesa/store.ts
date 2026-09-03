export type HoldPurpose = 'consult' | 'bail'
export type HoldStatus = 'pending' | 'held' | 'released' | 'failed'

export type Hold = {
  id: string
  purpose: HoldPurpose
  amountKes: number
  msisdn: string
  label: string
  status: HoldStatus
  checkoutRequestId: string | null
  mpesaReceipt: string | null
  createdAt: string
}

const g = globalThis as typeof globalThis & { __amiciHolds?: Map<string, Hold> }

function bag() {
  if (!g.__amiciHolds) g.__amiciHolds = new Map()
  return g.__amiciHolds
}

export function putHold(hold: Hold) {
  bag().set(hold.id, hold)
  return hold
}

export function getHold(id: string) {
  return bag().get(id) ?? null
}

export function findByCheckout(checkoutRequestId: string) {
  return [...bag().values()].find((h) => h.checkoutRequestId === checkoutRequestId) ?? null
}

export function listHolds() {
  return [...bag().values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function hasDarajaKeys() {
  return Boolean(
    process.env.MPESA_CONSUMER_KEY &&
      process.env.MPESA_CONSUMER_SECRET &&
      process.env.MPESA_SHORTCODE &&
      process.env.MPESA_PASSKEY,
  )
}
