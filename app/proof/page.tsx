'use client'

import { makeProof, type ProofKind } from '@/lib/proof'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'

function ProofBody() {
  const search = useSearchParams()
  const startKind: ProofKind = search.get('kind') === 'bail' ? 'bail' : 'consult'
  const advocate = search.get('advocate') ?? undefined
  const caseNumber = search.get('caseNumber') ?? undefined
  const amount = Number(search.get('amount') ?? '')
  const ref = search.get('ref') ?? undefined

  function build(kind: ProofKind) {
    return makeProof(kind, {
      advocate,
      caseNumber,
      amount: Number.isFinite(amount) ? amount : undefined,
      ref,
    })
  }

  const [kind, setKind] = useState<ProofKind>(startKind)
  const [pack, setPack] = useState(() => build(startKind))
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
            setPack(build('consult'))
          }}
        >
          Advocate hold
        </button>
        <button
          className={kind === 'bail' ? 'btn' : 'btn ghost'}
          type="button"
          onClick={() => {
            setKind('bail')
            setPack(build('bail'))
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

export default function Proof() {
  return (
    <Suspense>
      <ProofBody />
    </Suspense>
  )
}
