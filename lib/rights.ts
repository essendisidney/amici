export type ChatMsg = { from: 'me' | 'amici'; text: string }
export type RightsTopic = 'emergency' | 'lockout' | 'bail' | 'general'

export function rightsTopic(q: string): RightsTopic {
  const t = q.toLowerCase()
  if (/(danger|violence|beat|999|dharura)/.test(t)) return 'emergency'
  if (/(landlord|rent|evict|nyumba|panga|mwenye nyumba|lock|kufuli)/.test(t)) return 'lockout'
  if (/(bail|dhamana|jela|police|polisi)/.test(t)) return 'bail'
  return 'general'
}

export function rightsReply(q: string, sw: boolean): ChatMsg[] {
  const topic = rightsTopic(q)
  if (topic === 'emergency') {
    return [
      {
        from: 'amici',
        text: sw
          ? 'Hii inaonekana dharura. Toka kwenye programu. Piga 999 au nenda kituo cha polisi.'
          : 'This looks like an emergency. Leave the app. Call 999 or go to the nearest police station.',
      },
    ]
  }
  if (topic === 'lockout') {
    return [
      {
        from: 'amici',
        text: sw
          ? 'Mwenye nyumba hawezi kukufunga nje bila amri ya mahakama katika hali nyingi. Andika tarehe, risiti ya M-PESA, na picha ya kufuli. Hatua: fungua thread na wakili — binadamu hukagua kabla ya kufungua. Si ushauri.'
          : 'A landlord usually cannot lock you out without a court order. Note the date, keep the rent M-PESA receipt, and photograph the locks. Next: open a thread with an advocate — a human checks before filing. Not advice.',
      },
    ]
  }
  if (topic === 'bail') {
    return [
      {
        from: 'amici',
        text: sw
          ? 'Ukilipa dhamana na CTS ikashindwa, weka risiti ya M-PESA na nambari ya kesi. Amri rasmi ya kuachiliwa bado inatoka mahakamani.'
          : 'If you paid cash bail and CTS is down, keep the M-PESA receipt and the case number. The release order still comes from the court clerk.',
      },
    ]
  }
  return [
    {
      from: 'amici',
      text: sw
        ? 'Tumeelewa. Eleza mahali, tarehe, na unachotaka kitokee.'
        : 'Understood. Add the place, the date, and what you want to happen.',
    },
  ]
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

export const RIGHTS_DRAFT_KEY = 'amici-rights-draft'

export function saveRightsDraft(text: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(RIGHTS_DRAFT_KEY, text)
}

export function loadRightsDraft() {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(RIGHTS_DRAFT_KEY) ?? ''
}

export function clearRightsDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(RIGHTS_DRAFT_KEY)
}
