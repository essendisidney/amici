import { getHold, putHold } from '@/lib/mpesa/store'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { id } = (await request.json()) as { id?: string }
  const hold = id ? getHold(id) : null
  if (!hold || hold.status !== 'held') {
    return NextResponse.json({ error: 'Nothing to release.' }, { status: 400 })
  }
  putHold({ ...hold, status: 'released' })
  return NextResponse.json({ ok: true, status: 'released' })
}
