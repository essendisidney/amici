import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'
import { RightsChat } from './chat'
import type { ChatMsg } from '@/lib/rights'

export default async function Rights() {
  let signedIn = false
  let initial: ChatMsg[] = [{ from: 'amici', text: 'Say what happened. You get rights and next steps.' }]

  if (hasEnvVars) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    signedIn = Boolean(user)
    if (user) {
      const { data } = await supabase
        .from('rights_messages')
        .select('author, body')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(40)
      if (data?.length) {
        initial = data.map((row) => ({ from: row.author === 'user' ? 'me' : 'amici', text: row.body }))
      }
    }
  }

  return <RightsChat signedIn={signedIn} initial={initial} />
}
