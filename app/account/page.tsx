import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'
import { AccountForm } from './form'

export default async function Account() {
  if (!hasEnvVars) {
    return (
      <>
        <h1>Account</h1>
        <p className="lede">Onboarding writes to the profiles table after Supabase is linked.</p>
      </>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, lang, role')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <>
      <Link className="crumb" href="/">
        ← Home
      </Link>
      <h1>Who you are here</h1>
      <p className="lede">
        Role is stored on <code>profiles</code>, not in a JWT claim you can edit. You can move from citizen to
        advocate once. Staff later marks LSK verification.
      </p>
      <AccountForm
        email={user.email ?? ''}
        fullName={profile?.full_name ?? ''}
        phone={profile?.phone ?? ''}
        lang={profile?.lang ?? 'en'}
        role={profile?.role ?? 'citizen'}
      />
    </>
  )
}
