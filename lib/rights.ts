export type ChatMsg = { from: 'me' | 'amici'; text: string }

export function rightsReply(q: string, sw: boolean): ChatMsg[] {
  const t = q.toLowerCase()
  if (/(danger|violence|beat|999|dharura|piga)/.test(t)) {
    return [
      {
        from: 'amici',
        text: sw
          ? 'Hii inaonekana dharura. Toka kwenye programu. Piga 999 au nenda kituo cha polisi.'
          : 'This looks like an emergency. Leave the app. Call 999 or go to the nearest police station.',
      },
    ]
  }
  if (/(landlord|rent|evict|nyumba|panga|mwenye nyumba)/.test(t)) {
    return [
      {
        from: 'amici',
        text: sw
          ? 'Mwenye nyumba hawezi kukufunga nje bila amri ya mahakama katika hali nyingi. Andika tarehe na picha. Hatua: wakili wa madai madogo — binadamu hukagua kabla ya kufungua.'
          : 'A landlord usually cannot lock you out without a court order. Record dates and photograph the locks. Next: a Small Claims advocate — a human checks before filing.',
      },
    ]
  }
  if (/(bail|dhamana|jela|police|polisi)/.test(t)) {
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
