export function draftDemandLetter(input: {
  client: string
  opponent: string
  town: string
  facts: string
  amount?: string
}) {
  const today = new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
  return {
    docType: 'Demand letter',
    risk: 'Template only. Check names, dates, and the statute before you sign. Amici will not invent a case.',
    body: `${today}

WITHOUT PREJUDICE

Dear ${input.opponent || '[other party]'},

We act for ${input.client || '[client]'} of ${input.town || '[town]'}.

Our instructions are that:

${input.facts || '[facts in the client’s words]'}

${input.amount ? `The sum claimed is ${input.amount}.` : 'The remedy sought will be stated after we take full instructions.'}

Unless we receive a satisfactory written response within fourteen (14) days of this letter, our client may commence proceedings in the court of competent jurisdiction, including the Small Claims Court where the claim falls within its monetary limit.

This letter is a demand, not a court filing. It has not been filed on efiling.court.go.ke.

Yours faithfully,

[Advocate to sign after review]
`,
  }
}
