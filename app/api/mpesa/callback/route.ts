import { findByCheckout, putHold } from '@/lib/mpesa/store'
import { NextResponse } from 'next/server'

type Callback = {
  Body?: {
    stkCallback?: {
      CheckoutRequestID?: string
      ResultCode?: number
      CallbackMetadata?: { Item?: { Name: string; Value?: string | number }[] }
    }
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Callback
  const cb = payload.Body?.stkCallback
  if (!cb?.CheckoutRequestID) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing checkout' })
  }

  const hold = findByCheckout(cb.CheckoutRequestID)
  if (!hold) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }

  if (cb.ResultCode === 0) {
    const receipt = cb.CallbackMetadata?.Item?.find((i) => i.Name === 'MpesaReceiptNumber')?.Value
    putHold({
      ...hold,
      status: 'held',
      mpesaReceipt: receipt ? String(receipt) : hold.mpesaReceipt,
    })
  } else {
    putHold({ ...hold, status: 'failed' })
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
