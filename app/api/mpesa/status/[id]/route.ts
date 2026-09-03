import { getHold, hasDarajaKeys } from '@/lib/mpesa/store'
import { maskMsisdn } from '@/lib/mpesa/msisdn'
import { NextResponse } from 'next/server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hold = getHold(id)
  if (!hold) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    id: hold.id,
    status: hold.status,
    amountKes: hold.amountKes,
    purpose: hold.purpose,
    label: hold.label,
    matterId: hold.matterId,
    msisdn: maskMsisdn(hold.msisdn),
    mpesaReceipt: hold.mpesaReceipt,
    demo: !hasDarajaKeys(),
    createdAt: hold.createdAt,
  })
}
