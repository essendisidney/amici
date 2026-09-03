import Link from 'next/link'
import { causeDays } from '@/lib/cause-list'

export default function CauseList() {
  return (
    <>
      <Link className="crumb" href="/track">
        Track
      </Link>
      <p className="kicker">Amici cache · not the official portal</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>Cause list</h1>
      <p className="lede">When and where, in one glance. Confirm on the Judiciary cause list before you travel.</p>
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
                <th>Time</th>
                <th>Number</th>
                <th>Parties</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {day.rows.map((r) => (
                <tr key={r.number}>
                  <td>{r.time}</td>
                  <td>{r.number}</td>
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
