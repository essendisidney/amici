'use client'

import { loadFile, setMatterStatus, type Matter } from '@/lib/file-store'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Hold = {
  id: string
  status: string
  amountKes: number
  purpose: string
  label: string
  matterId: string | null
  msisdn: string
  mpesaReceipt: string | null
}

export function DemoQueue() {
  const [matters, setMatters] = useState<Matter[]>([])
  const [holds, setHolds] = useState<Hold[]>([])

  function refreshMatters() {
    setMatters(loadFile().matters)
  }

  async function refreshHolds() {
    const res = await fetch('/api/mpesa/holds')
    if (!res.ok) return
    const rows = (await res.json()) as Hold[]
    setHolds(rows.filter((row) => row.purpose === 'consult'))
  }

  useEffect(() => {
    refreshMatters()
    refreshHolds()
  }, [])

  function mark(id: string, status: Matter['status']) {
    const next = setMatterStatus(id, status)
    if (!next) return
    refreshMatters()
  }

  return (
    <>
      <section className="panel">
        <h2>Phone consults</h2>
        {matters.length === 0 && <p className="muted">No local matters yet. A citizen opens one from the lawyer card.</p>}
        {matters.map((m) => (
          <div className="row" key={m.id} style={{ alignItems: 'flex-start' }}>
            <div>
              <strong>{m.matter}</strong>
              <div className="muted">
                {m.advocate} · {m.status}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Link className="btn ghost" href={`/inbox/${m.id}`}>
                Thread
              </Link>
              <Link className="btn ghost" href={`/practice/brief/${m.id}`}>
                Brief
              </Link>
              {m.status === 'pending' ? (
                <button className="btn" type="button" onClick={() => mark(m.id, 'accepted')}>
                  Accept
                </button>
              ) : null}
              {m.status !== 'closed' ? (
                <button className="btn ghost" type="button" onClick={() => mark(m.id, 'closed')}>
                  Close
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </section>
      <section className="panel">
        <h2>Held consult money</h2>
        {holds.length === 0 && <p className="muted">No holds in this server process yet. Send STK from a matter thread.</p>}
        {holds.map((h) => (
          <div className="row" key={h.id}>
            <div>
              <strong>
                KSh {h.amountKes} · {h.status}
              </strong>
              <div className="muted">
                {h.label} · {h.msisdn} · {h.mpesaReceipt ?? 'awaiting receipt'}
              </div>
            </div>
            <Link href={h.matterId ? `/practice/brief/${h.matterId}` : '/pay/holds'}>
              {h.matterId ? 'Open brief' : 'Open holds'}
            </Link>
          </div>
        ))}
      </section>
    </>
  )
}
