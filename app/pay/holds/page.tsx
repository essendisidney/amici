'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Hold = {
  id: string
  status: string
  amountKes: number
  purpose: string
  label: string
  msisdn: string
  mpesaReceipt: string | null
}

export default function Holds() {
  const [rows, setRows] = useState<Hold[]>([])

  async function load() {
    const res = await fetch('/api/mpesa/holds')
    if (res.ok) setRows(await res.json())
  }

  useEffect(() => {
    load()
  }, [])

  async function release(id: string) {
    await fetch('/api/mpesa/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  return (
    <>
      <Link className="crumb" href="/practice">
        Practice
      </Link>
      <p className="kicker">Escrow</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>Holds</h1>
      <p className="lede">Money stays until the consult happens. Release is a human click, not automatic.</p>
      {rows.length === 0 && <p className="muted">No holds in this server process yet. Send an STK from Lipa.</p>}
      {rows.map((r) => (
        <div className="row" key={r.id}>
          <div>
            <strong>
              KSh {r.amountKes} · {r.status}
            </strong>
            <div className="muted">
              {r.label} · {r.msisdn} · {r.mpesaReceipt ?? '—'}
            </div>
          </div>
          {r.status === 'held' && (
            <button className="btn" type="button" onClick={() => release(r.id)}>
              Release
            </button>
          )}
        </div>
      ))}
    </>
  )
}
