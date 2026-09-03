const towns = [
  'Kahawa West',
  'Nairobi',
  'Kisumu',
  'Mombasa',
  'Nakuru',
  'Eldoret',
  'Westlands',
  'Thika',
  'Kitengela',
]

export function inferMatterTags(text: string) {
  const source = text.trim()
  const lower = source.toLowerCase()

  const town = towns.find((item) => lower.includes(item.toLowerCase())) ?? null

  let opponent: string | null = null
  if (lower.includes('landlord')) opponent = 'Landlord / property manager'
  else if (lower.includes('employer') || lower.includes('salary')) opponent = 'Employer'
  else if (lower.includes('county')) opponent = 'County office'
  else if (lower.includes('sacco')) opponent = 'Sacco'
  else if (lower.includes('police')) opponent = 'Police / station'
  else if (lower.includes('supplier') || lower.includes('invoice')) opponent = 'Supplier / client'

  return { town, opponent }
}
