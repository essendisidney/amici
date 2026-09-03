import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'
import { BookForm } from './book-form'

export default async function LawyerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let lawyer: {
    id: string
    slug: string
    display_name: string
    firm: string
    town: string
    bio: string
    fee_from: string
    timeline: string | null
    languages: string[]
    lsk_verified: boolean
  } | null = null

  if (hasEnvVars) {
    const supabase = await createClient()
    const { data } = await supabase.from('advocates').select('*').eq('slug', slug).eq('published', true).maybeSingle()
    lawyer = data
  } else if (slug === 'wambui' || slug === 'otieno' || slug === 'hassan') {
    const demo = {
      wambui: {
        id: 'demo-wambui',
        display_name: 'Wambui Njoroge',
        firm: 'Njoroge & Gathoni Advocates',
        town: 'Nairobi',
        bio: 'Takes SME and tenant matters that larger firms turn away.',
        fee_from: 'KSh 4,500 consult',
        timeline: 'First reply same day',
        languages: ['English', 'Kiswahili'],
      },
      otieno: {
        id: 'demo-otieno',
        display_name: 'Peter Otieno',
        firm: 'Otieno Legal',
        town: 'Kisumu',
        bio: 'Works with clients who cannot travel to Nairobi.',
        fee_from: 'KSh 6,000 consult',
        timeline: 'Hearing prep in 5–8 days',
        languages: ['English', 'Kiswahili', 'Dholuo'],
      },
      hassan: {
        id: 'demo-hassan',
        display_name: 'Amina Hassan',
        firm: 'Hassan Chambers',
        town: 'Mombasa',
        bio: 'Keeps a paper release-order pack for days CTS is down.',
        fee_from: 'KSh 3,000 consult',
        timeline: 'Bail papers same afternoon if CTS is up',
        languages: ['English', 'Kiswahili'],
      },
    }[slug]
    lawyer = { ...demo, slug, lsk_verified: true }
  }

  if (!lawyer) {
    return (
      <p>
        No such advocate. <Link href="/lawyers">Directory</Link>
      </p>
    )
  }

  return (
    <>
      <Link className="crumb" href="/lawyers">
        Directory
      </Link>
      <p className="kicker">{lawyer.town} · {lawyer.languages.join(' / ')}</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.6rem)', marginBottom: 12 }}>{lawyer.display_name}</h1>
      <p className="lede">{lawyer.firm}</p>
      <p>{lawyer.bio}</p>
      {lawyer.lsk_verified && <p className="trust">LSK practising certificate checked</p>}
      <p>
        {lawyer.fee_from} · {lawyer.timeline}
      </p>
      <BookForm advocateId={lawyer.id} advocateName={lawyer.display_name} demo={!hasEnvVars} />
    </>
  )
}
