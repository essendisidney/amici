export type ProofKind = 'consult' | 'bail'

export function makeProof(
  kind: ProofKind,
  extra?: { advocate?: string; caseNumber?: string; amount?: number; ref?: string },
) {
  const ref = extra?.ref ?? `AMICI-${kind === 'bail' ? 'B' : 'H'}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const amount = extra?.amount ?? (kind === 'bail' ? 5000 : 1500)
  const when = new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
  const body =
    kind === 'bail'
      ? `AMICI PROOF ${ref}\nPaid KSh ${amount} cash bail ref (demo).\nCase ${extra?.caseNumber ?? 'CR/2201/2026'}\n${when}\nNOT a release order. Court clerk must confirm on CTS.`
      : `AMICI HOLD ${ref}\nKSh ${amount} held for ${extra?.advocate ?? 'advocate'} consult.\nPaybill 400200 Acc AMICI-DEP\n${when}\nReleased when the milestone is done. Not a court fee.`

  return { ref, amount, when, kind, body }
}
