'use client'

import { makeProof, type ProofKind } from '@/lib/proof'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function Proof() {
  const [kind, setKind] = useState<ProofKind>('consult')
  const [pack, setPack] = useState(() => makeProof('consult'))
  const sms = useMemo(() => pack.body, [pack])

  return (
    <>
      <Link className="crumb" href="/ussd">
        USSD
      </Link>
      <p className="kicker">Works when CTS is down</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>SMS proof</h1>
      <p className="lede">
        A receipt you can show a clerk or a family member. It is not a release order and not a court stamp.{' '}
        <Link href="/pay">Send the STK first</Link>.
      </p>
      <div className="composer" style={{ marginBottom: 16 }}>
        <button
          className={kind === 'consult' ? 'btn' : 'btn ghost'}
          type="button"
          onClick={() => {
            setKind('consult')
            setPack(makeProof('consult'))
          }}
        >
          Advocate hold
        </button>
        <button
          className={kind === 'bail' ? 'btn' : 'btn ghost'}
          type="button"
          onClick={() => {
            setKind('bail')
            setPack(makeProof('bail', { caseNumber: 'CR/2201/2026', amount: 5000 }))
          }}
        >
          Cash bail
        </button>
      </div>
      <article className="sms">
        <div className="phone-net">+254 7XX · Inbox</div>
        <pre>{sms}</pre>
        <p className="muted">{pack.ref}</p>
      </article>
      <button
        className="btn ghost"
        type="button"
        onClick={() => navigator.clipboard?.writeText(sms)}
      >
        Copy SMS
      </button>
    </>
  )
}
