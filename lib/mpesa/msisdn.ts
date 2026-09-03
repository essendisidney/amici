export function toMsisdn(input: string) {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('254') && digits.length === 12) return digits
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`
  if (digits.length === 9 && digits.startsWith('7')) return `254${digits}`
  return null
}

export function maskMsisdn(msisdn: string) {
  return `${msisdn.slice(0, 5)}***${msisdn.slice(-3)}`
}
