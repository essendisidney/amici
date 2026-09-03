import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'
import { ListingForm } from './listing-form'
import { DemoQueue } from './demo-queue'
import { RequestRow } from './request-row'
import { ReviewRow } from './review-row'

const demoReview = [
  {
    id: 'r1',
    doc_type: 'Demand letter',
    client_label: 'Grace Muthoni',
    risk_note: 'Template only. Check dates before you sign.',
    body: 'WITHOUT PREJUDICE — locks changed 28 Aug 2026 after August rent was paid.',
  },
]

export default async function Practice() {
  if (!hasEnvVars) {
    return (
      <>
        <p className="kicker">Chambers · demo</p>
        <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.6rem)', marginBottom: 12 }}>Practice</h1>
        <p className="lede">Walk the desk now. Sign-in writes to Supabase once keys are linked.</p>
        <p>
          <Link className="btn" href="/practice/draft">
            Draft a letter
          </Link>{' '}
          <Link className="btn ghost" href="/pay/holds">
            Holds
          </Link>
        </p>
        <div className="alert">AI drafts stay here. Nothing leaves the firm until you sign.</div>
        <div className="dash">
          <DemoQueue />
          <section className="panel">
            <h2>Human review</h2>
            {demoReview.map((d) => (
              <ReviewRow
                key={d.id}
                id={d.id}
                docType={d.doc_type}
                client={d.client_label}
                risk={d.risk_note}
                body={d.body}
              />
            ))}
          </section>
        </div>
      </>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <>
        <h1>Practice</h1>
        <p className="lede">
          <Link href="/login?next=/practice">Sign in</Link> to see client requests.
        </p>
      </>
    )
  }

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).maybeSingle()

  if (profile?.role !== 'advocate') {
    return (
      <>
        <h1>Practice</h1>
        <p className="lede">This desk is for advocates.</p>
        <Link className="btn" href="/account">
          Open account
        </Link>
      </>
    )
  }

  const { data: advocate } = await supabase.from('advocates').select('id, slug, published, lsk_verified').eq('profile_id', user.id).maybeSingle()

  const { data: requests } = advocate
    ? await supabase
        .from('consult_requests')
        .select('id, matter, budget, status, created_at')
        .eq('advocate_id', advocate.id)
        .order('created_at', { ascending: false })
    : { data: [] as { id: string; matter: string; budget: string | null; status: string; created_at: string }[] }

  const { data: review } = advocate
    ? await supabase.from('review_items').select('*').eq('advocate_id', advocate.id).eq('status', 'queued')
    : { data: [] }

  return (
    <>
      <Link className="crumb" href="/">
        Home
      </Link>
      <p className="kicker">Chambers</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.6rem)', marginBottom: 12 }}>Practice</h1>
      <p className="lede">
        {profile.full_name || user.email}
        {advocate ? ` · /lawyers/${advocate.slug}` : ''}
        {advocate && !advocate.lsk_verified ? ' · draft, not in the public directory' : ''}
      </p>
      <p>
        <Link className="btn" href="/practice/draft">
          Draft a letter
        </Link>{' '}
        <Link className="btn ghost" href="/pay/holds">
          Holds
        </Link>
      </p>
      <div className="alert">AI drafts stay in this queue. Nothing leaves the firm until you sign.</div>
      {!advocate && <ListingForm />}
      <div className="dash">
        <section className="panel">
          <h2>New requests</h2>
          {(requests ?? []).length === 0 && <p className="muted">No consults yet.</p>}
          {(requests ?? []).map((r) => (
            <RequestRow key={r.id} id={r.id} matter={r.matter} budget={r.budget} status={r.status} />
          ))}
        </section>
        <section className="panel">
          <h2>Human review</h2>
          {(review ?? []).length === 0 && <p className="muted">Queue empty.</p>}
          {(review ?? []).map((d) => (
            <ReviewRow
              key={d.id}
              id={d.id}
              docType={d.doc_type}
              client={d.client_label}
              risk={d.risk_note}
              body={d.body}
            />
          ))}
        </section>
      </div>
    </>
  )
}
