import { listHolds } from '@/lib/mpesa/store'
import { maskMsisdn } from '@/lib/mpesa/msisdn'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    listHolds().map((h) => ({
      id: h.id,
      status: h.status,
      amountKes: h.amountKes,
      purpose: h.purpose,
      label: h.label,
      msisdn: maskMsisdn(h.msisdn),
      mpesaReceipt: h.mpesaReceipt,
    })),
  )
}
