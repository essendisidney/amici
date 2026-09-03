import type { Matter } from '@/lib/file-store'

export function evidenceSms(
  matter: Pick<
    Matter,
    'advocate' | 'matter' | 'clientName' | 'town' | 'opponent' | 'receiptRef' | 'evidenceNote' | 'messages'
  >,
  sw = true,
) {
  const client = matter.clientName?.trim() || (sw ? 'Jina litathibitishwa' : 'Name to confirm')
  const town = matter.town?.trim() || (sw ? 'Mahali litathibitishwa' : 'Town to confirm')
  const opponent = matter.opponent?.trim() || (sw ? 'Mpinzani atathibitishwa' : 'Other party to confirm')
  const receipt = matter.receiptRef?.trim() || (sw ? 'Risiti haijawekwa' : 'Receipt not yet added')
  const note =
    matter.evidenceNote?.trim() ||
    matter.messages.find((m) => m.from === 'me')?.text ||
    matter.matter

  if (sw) {
    return [
      'AMICI USHAHIDI (si filing)',
      `Wakili: ${matter.advocate}`,
      `Mteja: ${client}`,
      `Mahali: ${town}`,
      `Mpinzani: ${opponent}`,
      `Risiti: ${receipt}`,
      `Maelezo: ${note}`,
      'Si ushauri. Wakili bado anatia sahihi.',
    ].join('\n')
  }

  return [
    'AMICI EVIDENCE (not a filing)',
    `Advocate: ${matter.advocate}`,
    `Client: ${client}`,
    `Town: ${town}`,
    `Other party: ${opponent}`,
    `Receipt: ${receipt}`,
    `Notes: ${note}`,
    'Not advice. The advocate still signs.',
  ].join('\n')
}

/** Demo pack when USSD has no matter open on the handset. */
export function demoLockoutSms(sw = true) {
  return evidenceSms(
    {
      advocate: 'Wambui Njoroge',
      matter: 'Landlord locked her out — Kahawa West',
      clientName: 'Grace Muthoni',
      town: 'Kahawa West',
      opponent: 'Landlord / property manager',
      receiptRef: 'QJM4X8P2',
      evidenceNote: 'Locks changed 28 Aug after August rent paid. Photo of door pending.',
      messages: [],
    },
    sw,
  )
}
