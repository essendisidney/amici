import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { hasEnvVars } from '@/lib/utils'
import { Directory, type Listing } from './directory'

const fallback: Listing[] = [
  {
    id: 'demo-wambui',
    slug: 'wambui',
    display_name: 'Wambui Njoroge',
    firm: 'Njoroge & Gathoni Advocates',
    town: 'Nairobi',
    areas: ['Small claims', 'Employment', 'Contracts'],
    fee_from: 'KSh 4,500',
    lsk_verified: true,
  },
  {
    id: 'demo-otieno',
    slug: 'otieno',
    display_name: 'Peter Otieno',
    firm: 'Otieno Legal',
    town: 'Kisumu',
    areas: ['Land', 'Succession', 'Family'],
    fee_from: 'KSh 6,000',
    lsk_verified: true,
  },
  {
    id: 'demo-hassan',
    slug: 'hassan',
    display_name: 'Amina Hassan',
    firm: 'Hassan Chambers',
    town: 'Mombasa',
    areas: ['Bail', 'GBV', 'Children'],
    fee_from: 'KSh 3,000',
    lsk_verified: true,
  },
]

export default async function Lawyers() {
  let rows = fallback
  let fromDb = false
  if (hasEnvVars) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('advocates')
      .select('id, slug, display_name, firm, town, areas, fee_from, lsk_verified')
      .eq('published', true)
      .order('town')
    if (data?.length) {
      rows = data
      fromDb = true
    }
  }

  return (
    <>
      <Link className="crumb" href="/citizen">
        Back
      </Link>
      <p className="kicker">{fromDb ? 'Live roll' : 'Demo roll'}</p>
      <h1 style={{ fontSize: 'clamp(2.6rem, 8vw, 4.8rem)', marginBottom: 12 }}>Find a wakili</h1>
      <p className="lede">Fees in shillings. Town on the stub. LSK check is a stamp, not a vibe.</p>
      <Directory rows={rows} />
    </>
  )
}
