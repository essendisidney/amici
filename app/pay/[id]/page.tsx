'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Status = {
  id: string
  status: 'pending' | 'held' | 'released' | 'failed'
  amountKes: number
  purpose: string
  label: string
  msisdn: string
  mpesaReceipt: string | null
  demo: boolean
}

export default function PayWait() {
  const { id } = useParams<{ id: string }>()
  const search = useSearchParams()
  const matterId = search.get('matterId')
  const [row, setRow] = useState<Status | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    const res = await fetch(`/api/mpesa/status/${id}`)
    const json = await res.json()
    if (!res.ok) setError(json.error ?? 'Missing')
    else setRow(json)
  }

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 2500)
    return () => clearInterval(t)
  }, [id])

  async function simulate(result: 'ok' | 'fail') {
    await fetch('/api/mpesa/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, result }),
    })
    refresh()
  }

  return (
    <>
      <Link className="crumb" href="/pay">
        Lipa
      </Link>
      <p className="kicker">{row?.demo ? 'Demo PIN' : 'Handset PIN'}</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>Check the phone</h1>
      {!row && <p className="lede">{error ?? 'Looking for the push…'}</p>}
      {row && (
        <>
          <p className="lede">
            {row.amountKes.toLocaleString('en-KE')} to {row.msisdn} · {row.label}
          </p>
          <div className="sms">
            <div className="phone-net">M-PESA</div>
            <pre>
              {row.status === 'pending' && 'Enter PIN to pay Amici hold.\nThis is not a court filing.'}
              {row.status === 'held' && `Confirmed. ${row.mpesaReceipt}\nHeld until the milestone.`}
              {row.status === 'failed' && 'Cancelled or timed out.\nNo money moved.'}
              {row.status === 'released' && `Released to the advocate.\n${row.mpesaReceipt}`}
            </pre>
          </div>
          {row.status === 'pending' && row.demo && (
            <div className="composer">
              <button className="btn" type="button" onClick={() => simulate('ok')}>
                I entered PIN
              </button>
              <button className="btn ghost" type="button" onClick={() => simulate('fail')}>
                Cancel
              </button>
            </div>
          )}
          {row.status === 'held' && (
            <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link
                className="btn"
                href={`/proof?kind=${encodeURIComponent(row.purpose)}&amount=${row.amountKes}&advocate=${encodeURIComponent(row.label)}&ref=${encodeURIComponent(row.mpesaReceipt ?? '')}`}
              >
                Open SMS proof
              </Link>
              {matterId ? (
                <Link className="btn ghost" href={`/inbox/${matterId}`}>
                  Back to thread
                </Link>
              ) : null}
            </p>
          )}
          {row.status === 'released' && matterId ? (
            <p>
              <Link className="btn ghost" href={`/inbox/${matterId}`}>
                Back to thread
              </Link>
            </p>
          ) : null}
        </>
      )}
    </>
  )
}
