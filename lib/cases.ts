export const caseCache: Record<
  string,
  {
    number: string
    title: string
    court: string
    status: string
    next: string
    judge: string
    steps: { label: string; date: string; done: boolean }[]
  }
> = {
  'HCCC/1234/2023': {
    number: 'HCCC/1234/2023',
    title: 'Mwangi v City Council',
    court: 'Milimani High Court, Civil',
    status: 'Mention — awaiting ruling upload',
    next: 'Mention 12 Sep 2026, 09:00, Court 6',
    judge: 'Hon. Justice A. Kariuki',
    steps: [
      { label: 'Plaint filed (e-filing)', date: '14 Mar 2023', done: true },
      { label: 'Defence filed', date: '2 May 2023', done: true },
      { label: 'Hearing concluded', date: '18 Jul 2026', done: true },
      { label: 'Ruling said delivered', date: '28 Aug 2026', done: true },
      { label: 'Ruling on CTS', date: 'Not yet', done: false },
    ],
  },
  'SCCC/441/2026': {
    number: 'SCCC/441/2026',
    title: 'Achieng v Juma Hardware',
    court: 'Milimani Small Claims',
    status: 'Hearing scheduled',
    next: 'Hearing 8 Sep 2026, 11:30',
    judge: 'Hon. Adjudicator M. Wekesa',
    steps: [
      { label: 'Claim filed', date: '3 Jun 2026', done: true },
      { label: 'Response filed', date: '21 Jun 2026', done: true },
      { label: 'Hearing', date: '8 Sep 2026', done: false },
    ],
  },
}
