'use client'

import Link from 'next/link'
import { useLang } from '@/components/Lang'

export default function Home() {
  const { t } = useLang()
  return (
    <section className="hero">
      <p className="kicker">{t.kicker}</p>
      <h1>
        {t.tagA}
        <br />
        <span className="soft">{t.tagB}</span>
      </h1>
      <p className="lede">{t.citizenLead}</p>
      <div className="split">
        <Link className="door accent" href="/citizen">
          <span className="num">01 — public</span>
          <h2>{t.citizen}</h2>
          <p>{t.citizenLead}</p>
        </Link>
        <Link className="door" href="/practice">
          <span className="num">02 — chambers</span>
          <h2>{t.lawyer}</h2>
          <p>{t.lawyerLead}</p>
        </Link>
      </div>
      <div className="ussd">
        <div>
          <strong>{t.ussd}</strong>
          <p className="muted" style={{ margin: '6px 0 0' }}>
            {t.ussdHint}
          </p>
        </div>
        <Link href="/ussd">
          <code>*483*54#</code>
        </Link>
      </div>
      <p className="notice">{t.notOfficial}</p>
      <div className="ticker">
        <span>HCCC/1234/2023 · ruling not on CTS</span>
        <span>SCCC/441/2026 · hearing 8 Sep</span>
        <span>Milimani · Kisumu · Mombasa</span>
        <span>M-PESA hold · human review</span>
      </div>
    </section>
  )
}
