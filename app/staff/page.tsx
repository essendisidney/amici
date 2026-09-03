import Link from 'next/link'
import { stampAdvocate } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'

const demo = [
  { id: 'demo-1', display_name: 'Wambui Njoroge', town: 'Nairobi', lsk_verified: true, published: true },
  { id: 'demo-2', display_name: 'New chambers — draft', town: 'Eldoret', lsk_verified: false, published: false },
]

export default async function Staff() {
  let rows = demo
  if (hasEnvVars) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('advocates')
      .select('id, display_name, town, lsk_verified, published')
      .order('created_at', { ascending: false })
    if (data?.length) rows = data
  }

  return (
    <>
      <Link className="crumb" href="/">
        Home
      </Link>
      <p className="kicker">Staff only</p>
      <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4rem)', marginBottom: 12 }}>LSK stamp</h1>
      <p className="lede">
        Advocates cannot tick this themselves. Staff checks the practising certificate, then the card goes public.
      </p>
      {rows.map((a) => (
        <div className="row" key={a.id}>
          <div>
            <strong>{a.display_name}</strong>
            <div className="muted">
              {a.town} · {a.lsk_verified ? 'stamped' : 'waiting'} · {a.published ? 'public' : 'hidden'}
            </div>
          </div>
          {!a.lsk_verified && hasEnvVars && (
            <form action={stampAdvocate}>
              <input type="hidden" name="id" value={a.id} />
              <button className="btn" type="submit">
                Stamp
              </button>
            </form>
          )}
        </div>
      ))}
    </>
  )
}
