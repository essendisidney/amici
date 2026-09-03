import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'
import { FlagButton } from './flag-button'

const fallback = [
  { id: '1', case_number: 'HCCC/1234/2023', court: 'Milimani Civil', delivered_on: '2026-08-28', uploaded_on: null },
  { id: '2', case_number: 'ELRC/88/2025', court: 'Nairobi ELRC', delivered_on: '2026-08-12', uploaded_on: '2026-09-02' },
]

export default async function Integrity() {
  let rows = fallback
  if (hasEnvVars) {
    const supabase = await createClient()
    const { data } = await supabase.from('integrity_gaps').select('*').order('delivered_on', { ascending: false })
    if (data?.length) rows = data
  }

  return (
    <>
      <Link className="crumb" href="/">
        Home
      </Link>
      <p className="kicker">Delivery vs upload</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.6rem)', marginBottom: 12 }}>Upload watch</h1>
      <p className="lede">
        When a ruling is said to be delivered but not posted, appeal clocks start anyway. This is a public delay mark,
        not a court filing.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Case</th>
            <th>Court</th>
            <th>Said delivered</th>
            <th>On CTS</th>
            <th>Gap</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const days = Math.round(
              ((r.uploaded_on ? new Date(r.uploaded_on).getTime() : Date.now()) - new Date(r.delivered_on).getTime()) /
                86400000,
            )
            return (
              <tr key={r.id}>
                <td>{r.case_number}</td>
                <td>{r.court}</td>
                <td>{r.delivered_on}</td>
                <td>{r.uploaded_on ?? '—'}</td>
                <td className={days > 7 ? 'late' : 'ok'}>{days}d</td>
                <td>{!r.uploaded_on && <FlagButton gapId={r.id} enabled={hasEnvVars} />}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
