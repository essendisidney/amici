'use client'

import Link from 'next/link'
import { useLang } from '@/components/Lang'

export default function Citizen() {
  const { t } = useLang()
  return (
    <>
      <Link className="crumb" href="/">
        {t.home}
      </Link>
      <p className="kicker">Wanjiku desk</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.8rem)', marginBottom: 16 }}>{t.citizen}</h1>
      <p className="lede">{t.citizenLead}</p>
      <div className="grid3">
        <Link className="tile" href="/rights">
          <span className="num">01</span>
          <div>
            <h3>{t.knowRights}</h3>
            <p>Speak it. Kiswahili first. Lock-out chip opens a wakili thread.</p>
          </div>
        </Link>
        <Link className="tile" href="/lawyers">
          <span className="num">02</span>
          <div>
            <h3>{t.findLawyer}</h3>
            <p>Town, language, fee on the ticket. Not a WhatsApp rumour.</p>
          </div>
        </Link>
        <Link className="tile" href="/track">
          <span className="num">03</span>
          <div>
            <h3>{t.trackCase}</h3>
            <p>Your number, plain. CTS still owns the truth.</p>
          </div>
        </Link>
      </div>
      <p style={{ marginTop: 16 }}>
        <Link href="/desk">{t.desk}</Link>
        {' · '}
        <Link href="/inbox">{t.inbox}</Link>
      </p>
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
    </>
  )
}
