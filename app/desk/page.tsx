import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'
import { caseCache } from '@/lib/cases'
import { PhoneFile } from './phone-file'
import { WatchRows } from './watch-rows'

export default async function Desk() {
  let watches: { case_number: string; title: string | null; court: string | null; status_note: string | null }[] = []
  let requests: { id: string; matter: string; status: string }[] = []
  let signedIn = false

  if (hasEnvVars) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    signedIn = Boolean(user)
    if (user) {
      const { data: w } = await supabase
        .from('case_watches')
        .select('case_number, title, court, status_note')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      watches = w ?? []
      const { data: r } = await supabase
        .from('consult_requests')
        .select('id, matter, status')
        .eq('citizen_id', user.id)
        .order('created_at', { ascending: false })
      requests = r ?? []
    }
  } else {
    watches = [
      {
        case_number: 'HCCC/1234/2023',
        title: caseCache['HCCC/1234/2023'].title,
        court: caseCache['HCCC/1234/2023'].court,
        status_note: caseCache['HCCC/1234/2023'].status,
      },
    ]
  }

  return (
    <>
      <Link className="crumb" href="/citizen">
        Public desk
      </Link>
      <p className="kicker">Your file</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.6rem)', marginBottom: 12 }}>Desk</h1>
      <p className="lede">
        Watches and consults in one place. Official status still belongs to CTS. Hearing pings live in the{' '}
        <Link href="/inbox">inbox</Link>.
        {!signedIn && hasEnvVars ? (
          <>
            {' '}
            <Link href="/login?next=/desk">Sign in</Link> to keep them.
          </>
        ) : null}
      </p>
      <div className="dash">
        <section className="panel">
          <h2>Watched numbers</h2>
          <WatchRows
            serverWatches={watches.map((w) => ({
              number: w.case_number,
              title: w.title ?? w.case_number,
              court: w.court ?? '',
            }))}
          />
        </section>
        <section className="panel">
          <h2>Consults</h2>
          {requests.length === 0 && (
            <p className="muted">
              No requests yet. <Link href="/lawyers">Find a wakili</Link>
            </p>
          )}
          {requests.map((r) => (
            <div className="row" key={r.id}>
              <strong>{r.matter}</strong>
              <span className="muted">{r.status}</span>
            </div>
          ))}
        </section>
      </div>
      <PhoneFile />
    </>
  )
}
