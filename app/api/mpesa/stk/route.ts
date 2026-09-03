import { stkPush } from '@/lib/mpesa/daraja'
import { toMsisdn } from '@/lib/mpesa/msisdn'
import { putHold, type HoldPurpose } from '@/lib/mpesa/store'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    phone?: string
    amountKes?: number
    purpose?: HoldPurpose
    label?: string
    matterId?: string
  }

  const msisdn = toMsisdn(body.phone ?? '')
  if (!msisdn) {
    return NextResponse.json({ error: 'Use a Kenyan mobile: 07… or 01…' }, { status: 400 })
  }

  const amountKes = Number(body.amountKes)
  if (!Number.isFinite(amountKes) || amountKes < 1 || amountKes > 150000) {
    return NextResponse.json({ error: 'Amount must be between 1 and 150,000.' }, { status: 400 })
  }

  const purpose: HoldPurpose = body.purpose === 'bail' ? 'bail' : 'consult'
  const id = crypto.randomUUID()
  const label = (body.label ?? purpose).slice(0, 80)
  const matterId = body.matterId?.slice(0, 80) ?? null

  try {
    const push = await stkPush({
      msisdn,
      amountKes,
      account: `AMICI${id.slice(0, 6).toUpperCase()}`,
      desc: purpose === 'bail' ? 'Bail proof' : 'Consult hold',
    })

    putHold({
      id,
      purpose,
      amountKes,
      msisdn,
      label,
      matterId,
      status: 'pending',
      checkoutRequestId: push.checkoutRequestId,
      mpesaReceipt: null,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ id, demo: push.demo, status: 'pending' })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'STK failed' }, { status: 502 })
  }
}
