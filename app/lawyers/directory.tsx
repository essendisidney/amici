'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export type Listing = {
  id: string
  slug: string
  display_name: string
  firm: string
  town: string
  areas: string[]
  fee_from: string
  lsk_verified: boolean
}

export function Directory({ rows }: { rows: Listing[] }) {
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const s = q.toLowerCase()
    return rows.filter(
      (l) =>
        !s ||
        l.display_name.toLowerCase().includes(s) ||
        l.town.toLowerCase().includes(s) ||
        l.firm.toLowerCase().includes(s) ||
        (l.areas ?? []).some((a) => a.toLowerCase().includes(s)),
    )
  }, [q, rows])

  return (
    <>
      <div className="field">
        <label htmlFor="q">Town, name, or matter</label>
        <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kisumu · land · bail" />
      </div>
      <div className="cards">
        {list.map((l) => (
          <Link key={l.id} className="card" href={`/lawyers/${l.slug}`}>
            <span className="town">{l.town}</span>
            <div className="body">
              <h3>{l.display_name}</h3>
              <p className="muted">{l.firm}</p>
              <div className="chips">
                {(l.areas ?? []).map((a) => (
                  <span key={a} className="chip">
                    {a}
                  </span>
                ))}
              </div>
              {l.lsk_verified && <p className="trust">LSK checked</p>}
            </div>
            <div className="fee">
              <span>from</span>
              <strong>{l.fee_from}</strong>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
