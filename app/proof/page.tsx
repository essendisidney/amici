'use client'

import { EvidenceSms } from '@/components/EvidenceSms'
import { HearingSms } from '@/components/HearingSms'
import { useLang } from '@/components/Lang'
import { getMatter } from '@/lib/file-store'
import { makeProof, type ProofKind } from '@/lib/proof'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

type Tab = ProofKind | 'hearing' | 'evidence'

function ProofBody() {
  const { t } = useLang()
  const search = useSearchParams()
  const n = (search.get('n') ?? search.get('caseNumber') ?? 'HCCC/1234/2023').trim().toUpperCase()
  const matterId = search.get('matterId') ?? 'm-grace'
  const start: Tab =
    search.get('kind') === 'bail'
      ? 'bail'
      : search.get('kind') === 'hearing'
        ? 'hearing'
        : search.get('kind') === 'evidence'
          ? 'evidence'
          : 'consult'
  const advocate = search.get('advocate') ?? undefined
  const amount = Number(search.get('amount') ?? '')
  const ref = search.get('ref') ?? undefined

  function build(kind: ProofKind) {
    return makeProof(kind, {
      advocate,
      caseNumber: n,
      amount: Number.isFinite(amount) ? amount : undefined,
      ref,
    })
  }

  const [tab, setTab] = useState<Tab>(start)
  const [pack, setPack] = useState(() => build(start === 'bail' ? 'bail' : 'consult'))
  const [matter, setMatter] = useState<ReturnType<typeof getMatter>>(null)
  const sms = useMemo(() => pack.body, [pack])

  useEffect(() => {
    setMatter(getMatter(matterId))
  }, [matterId])

  const title =
    tab === 'hearing' ? t.hearingSms : tab === 'evidence' ? t.evidencePack : 'SMS proof'
  const lead =
    tab === 'hearing' ? (
      t.hearingSmsLead
    ) : tab === 'evidence' ? (
      t.evidencePackLead
    ) : (
      <>
        A receipt you can show a clerk or a family member. It is not a release order and not a court stamp.{' '}
        <Link href="/pay">Send the STK first</Link>.
      </>
    )

  return (
    <>
      <Link className="crumb" href="/ussd">
        USSD
      </Link>
      <p className="kicker">Works when CTS is down</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>{title}</h1>
      <p className="lede">{lead}</p>
      <div className="composer" style={{ marginBottom: 16 }}>
        <button className={tab === 'hearing' ? 'btn' : 'btn ghost'} type="button" onClick={() => setTab('hearing')}>
          {t.hearingSms}
        </button>
        <button className={tab === 'evidence' ? 'btn' : 'btn ghost'} type="button" onClick={() => setTab('evidence')}>
          {t.evidencePack}
        </button>
        <button
          className={tab === 'consult' ? 'btn' : 'btn ghost'}
          type="button"
          onClick={() => {
            setTab('consult')
            setPack(build('consult'))
          }}
        >
          Advocate hold
        </button>
        <button
          className={tab === 'bail' ? 'btn' : 'btn ghost'}
          type="button"
          onClick={() => {
            setTab('bail')
            setPack(build('bail'))
          }}
        >
          Cash bail
        </button>
      </div>
      {tab === 'hearing' ? (
        <HearingSms number={n} />
      ) : tab === 'evidence' ? (
        matter ? (
          <>
            <EvidenceSms matter={matter} />
            <p className="muted">
              <Link href={`/inbox/${matter.id}`}>Open thread</Link>
              {' · '}
              <Link href={`/practice/brief/${matter.id}`}>Chambers brief</Link>
            </p>
          </>
        ) : (
          <p className="notice">
            No matter on this phone. Open a lock-out thread first.{' '}
            <Link href="/inbox">Inbox</Link>
          </p>
        )
      ) : (
        <>
          <article className="sms">
            <div className="phone-net">+254 7XX · Inbox</div>
            <pre>{sms}</pre>
            <p className="muted">{pack.ref}</p>
          </article>
          <button className="btn ghost" type="button" onClick={() => navigator.clipboard?.writeText(sms)}>
            {t.copySms}
          </button>
        </>
      )}
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
