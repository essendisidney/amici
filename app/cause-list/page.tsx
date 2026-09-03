'use client'

import Link from 'next/link'
import { causeDays } from '@/lib/cause-list'
import { useLang } from '@/components/Lang'

export default function CauseList() {
  const { t } = useLang()

  return (
    <>
      <Link className="crumb" href="/track">
        {t.trackCase}
      </Link>
      <p className="kicker">{t.causeListConfirm}</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>{t.causeListTitle}</h1>
      <p className="lede">{t.causeListLead}</p>
      <p className="alert" style={{ background: 'rgba(214, 255, 61, 0.08)', borderColor: 'rgba(214, 255, 61, 0.35)' }}>
        {t.tapCase}
      </p>
      {causeDays.map((day) => (
        <section className="panel" key={day.date} style={{ marginBottom: 12 }}>
          <h2>
            {day.date}
            <span className="muted" style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '0.95rem', fontWeight: 400 }}>
              {day.court}
            </span>
          </h2>
          <table className="table">
            <thead>
              <tr>
                <th>{t.colTime}</th>
                <th>{t.colNumber}</th>
                <th>{t.colParties}</th>
                <th>{t.colRoom}</th>
              </tr>
            </thead>
            <tbody>
              {day.rows.map((r) => (
                <tr key={r.number}>
                  <td>{r.time}</td>
                  <td>
                    <Link href={`/track?n=${encodeURIComponent(r.number)}`}>{r.number}</Link>
                  </td>
                  <td>{r.parties}</td>
                  <td>{r.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </>
  )
}
