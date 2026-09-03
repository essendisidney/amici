'use server'

import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/rights'
import { hasEnvVars } from '@/lib/utils'
import { redirect } from 'next/navigation'

export async function signInWithEmail(formData: FormData) {
  if (!hasEnvVars) {
    return { error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.' }
  }
  const email = String(formData.get('email') ?? '').trim()
  const next = String(formData.get('next') ?? '/practice')
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function requestConsult(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/lawyers')

  const advocateId = String(formData.get('advocate_id') ?? '')
  const matter = String(formData.get('matter') ?? '').trim()
  if (!advocateId || !matter) return { error: 'Describe the matter.' }

  const { error } = await supabase.from('consult_requests').insert({
    citizen_id: user.id,
    advocate_id: advocateId,
    matter,
    budget: String(formData.get('budget') ?? '') || null,
  })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function holdEscrow(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const advocateId = String(formData.get('advocate_id') ?? '')
  const amount = Number(formData.get('amount_kes') ?? 1500)
  const { error } = await supabase.from('escrow_intents').insert({
    citizen_id: user.id,
    advocate_id: advocateId,
    amount_kes: amount,
    status: 'held',
    mpesa_ref: `DEMO-${Date.now()}`,
  })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function flagIntegrityGap(gapId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/integrity')

  const { error } = await supabase.from('integrity_flags').insert({
    gap_id: gapId,
    flagged_by: user.id,
  })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/account')

  const role = String(formData.get('role') ?? 'citizen')
  if (role !== 'citizen' && role !== 'advocate') return { error: 'Pick citizen or advocate.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: String(formData.get('full_name') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim() || null,
      lang: String(formData.get('lang') ?? 'en'),
      role,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  redirect(role === 'advocate' ? '/practice' : '/citizen')
}

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/practice')

  const displayName = String(formData.get('display_name') ?? '').trim()
  const firm = String(formData.get('firm') ?? '').trim()
  const town = String(formData.get('town') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()
  if (!displayName || !firm || !town || !bio) return { error: 'Name, firm, town, and bio are required.' }

  const slug = `${slugify(displayName)}-${user.id.slice(0, 6)}`

  const { error } = await supabase.from('advocates').insert({
    profile_id: user.id,
    slug,
    display_name: displayName,
    firm,
    town,
    bio,
    fee_from: String(formData.get('fee_from') ?? 'KSh 3,000 consult').trim(),
    timeline: String(formData.get('timeline') ?? '').trim() || null,
    languages: String(formData.get('languages') ?? 'English, Kiswahili')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    areas: String(formData.get('areas') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    lsk_verified: false,
    published: false,
  })
  if (error) return { error: error.message }
  return { ok: true }
}

export async function setConsultStatus(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/practice')

  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!id || !['pending', 'accepted', 'closed'].includes(status)) return

  await supabase.from('consult_requests').update({ status }).eq('id', id)
}

export async function persistRightsTurn(userText: string, amiciText: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const { error } = await supabase.from('rights_messages').insert([
    { user_id: user.id, author: 'user', body: userText },
    { user_id: user.id, author: 'amici', body: amiciText },
  ])
  if (error) return { error: error.message }
  return { ok: true }
}

export async function watchCase(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/track')

  const caseNumber = String(formData.get('case_number') ?? '').trim().toUpperCase()
  if (!caseNumber) return { error: 'Enter a case number.' }

  const { error } = await supabase.from('case_watches').upsert(
    {
      user_id: user.id,
      case_number: caseNumber,
      title: String(formData.get('title') ?? '') || null,
      court: String(formData.get('court') ?? '') || null,
      status_note: String(formData.get('status_note') ?? '') || null,
    },
    { onConflict: 'user_id,case_number' },
  )
  if (error) return { error: error.message }
  return { ok: true }
}

export async function queueDraft(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/practice/draft')

  const { data: advocate } = await supabase.from('advocates').select('id').eq('profile_id', user.id).maybeSingle()
  if (!advocate) return { error: 'Save your chambers card first.' }

  const { draftDemandLetter } = await import('@/lib/draft')
  const draft = draftDemandLetter({
    client: String(formData.get('client') ?? ''),
    opponent: String(formData.get('opponent') ?? ''),
    town: String(formData.get('town') ?? ''),
    facts: String(formData.get('facts') ?? ''),
    amount: String(formData.get('amount') ?? ''),
  })

  const { error } = await supabase.from('review_items').insert({
    advocate_id: advocate.id,
    client_label: String(formData.get('client') ?? 'Client').trim() || 'Client',
    doc_type: draft.docType,
    risk_note: draft.risk,
    body: draft.body,
    status: 'queued',
  })
  if (error) return { error: error.message }
  redirect('/practice')
}

export async function resolveReview(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/practice')

  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!id || !['approved', 'rejected'].includes(status)) return

  await supabase.from('review_items').update({ status }).eq('id', id)
}

export async function stampAdvocate(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/staff')

  const id = String(formData.get('id') ?? '')
  await supabase.rpc('stamp_advocate', { target: id })
}
