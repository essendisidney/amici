import { getHold, hasDarajaKeys, putHold } from '@/lib/mpesa/store'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (hasDarajaKeys()) {
    return NextResponse.json({ error: 'Live Daraja is on. Enter the PIN on the handset.' }, { status: 403 })
  }

  const { id, result } = (await request.json()) as { id?: string; result?: 'ok' | 'fail' }
  const hold = id ? getHold(id) : null
  if (!hold || hold.status !== 'pending') {
    return NextResponse.json({ error: 'No pending push to confirm.' }, { status: 400 })
  }

  putHold({
    ...hold,
    status: result === 'fail' ? 'failed' : 'held',
    mpesaReceipt: result === 'fail' ? null : `DEMO${hold.id.slice(0, 6).toUpperCase()}`,
  })
  return NextResponse.json({ ok: true, status: result === 'fail' ? 'failed' : 'held' })
}
