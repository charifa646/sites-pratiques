// ─── MOCK DATA (prototype only — never use in production) ──────────────────

export type Service = {
  id: string
  name: string
  duration: number // minutes
  price: number // FCFA
  description: string
}

export type Coach = {
  slug: string
  name: string
  initials: string
  title: string
  city: string
  bio: string
  services: Service[]
}

export type TimeSlot = {
  id: string
  time: string // "HH:MM"
  available: boolean
}

export type DaySlots = {
  date: string // ISO "YYYY-MM-DD"
  slots: TimeSlot[]
}

export type Booking = {
  id: string
  clientName: string
  clientPhone: string
  clientInitials: string
  service: Service
  date: string
  time: string
  amount: number
  paymentMethod: 'wave' | 'orange'
  status: 'paid' | 'pending'
}

// ─── Coach profile (mock) ─────────────────────────────────────────────────
export const MOCK_COACH: Coach = {
  slug: 'mariam-toure',
  name: 'Mariam Touré',
  initials: 'MT',
  title: 'Coach en leadership & carrière',
  city: 'Abidjan · visio ou présentiel',
  bio: 'J\'accompagne les professionnels et managers dans leur développement personnel et leur progression de carrière. Certifiée ICF, 8 ans d\'expérience.',
  services: [
    {
      id: 'seance-individuelle',
      name: 'Séance individuelle',
      duration: 60,
      price: 25000,
      description: 'Session de coaching personnalisée, en visio ou en présentiel à Abidjan.',
    },
    {
      id: 'consultation-express',
      name: 'Consultation express',
      duration: 30,
      price: 12000,
      description: 'Session courte pour une problématique ciblée. Idéal pour un point rapide.',
    },
    {
      id: 'pack-4-seances',
      name: 'Pack 4 séances',
      duration: 240,
      price: 90000,
      description: 'Accompagnement sur 4 séances pour une transformation durable. -10% vs tarif unitaire.',
    },
  ],
}

// ─── Availability (mock — next 14 days) ──────────────────────────────────
export function getMockAvailability(fromDate: string): DaySlots[] {
  const slots: DaySlots[] = []
  const base = new Date(fromDate)

  for (let d = 0; d < 14; d++) {
    const date = new Date(base)
    date.setDate(base.getDate() + d)

    const dayOfWeek = date.getDay()
    // No slots on Sundays (0)
    if (dayOfWeek === 0) continue

    const dateStr = date.toISOString().split('T')[0]
    const daySlots: TimeSlot[] = []

    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    times.forEach((time, i) => {
      // Mock: some slots booked
      const booked = (d + i) % 4 === 0 || (d === 1 && i < 2)
      daySlots.push({
        id: `${dateStr}-${time}`,
        time,
        available: !booked,
      })
    })

    slots.push({ date: dateStr, slots: daySlots })
  }

  return slots
}

// ─── Dashboard bookings (mock) ────────────────────────────────────────────
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b001',
    clientName: 'Awa Cissé',
    clientInitials: 'AC',
    clientPhone: '+221 77 000 00 01',
    service: MOCK_COACH.services[0],
    date: '2026-06-08',
    time: '09:00',
    amount: 25000,
    paymentMethod: 'wave',
    status: 'paid',
  },
  {
    id: 'b002',
    clientName: 'Ibrahim Bâ',
    clientInitials: 'IB',
    clientPhone: '+221 76 000 00 02',
    service: MOCK_COACH.services[1],
    date: '2026-06-08',
    time: '10:30',
    amount: 12000,
    paymentMethod: 'orange',
    status: 'paid',
  },
  {
    id: 'b003',
    clientName: 'Nadia Koné',
    clientInitials: 'NK',
    clientPhone: '+225 05 000 00 03',
    service: MOCK_COACH.services[0],
    date: '2026-06-08',
    time: '14:00',
    amount: 25000,
    paymentMethod: 'wave',
    status: 'paid',
  },
  {
    id: 'b004',
    clientName: 'Omar Fall',
    clientInitials: 'OF',
    clientPhone: '+221 77 000 00 04',
    service: MOCK_COACH.services[2],
    date: '2026-06-08',
    time: '16:00',
    amount: 90000,
    paymentMethod: 'orange',
    status: 'paid',
  },
  {
    id: 'b005',
    clientName: 'Fatou Diallo',
    clientInitials: 'FD',
    clientPhone: '+224 621 00 00 05',
    service: MOCK_COACH.services[0],
    date: '2026-06-09',
    time: '09:00',
    amount: 25000,
    paymentMethod: 'wave',
    status: 'paid',
  },
  {
    id: 'b006',
    clientName: 'Moussa Traoré',
    clientInitials: 'MT',
    clientPhone: '+226 70 000 006',
    service: MOCK_COACH.services[1],
    date: '2026-06-09',
    time: '11:00',
    amount: 12000,
    paymentMethod: 'wave',
    status: 'paid',
  },
]

// ─── Dashboard KPIs (mock) ────────────────────────────────────────────────
export const MOCK_KPIS = {
  encaisseMonth: 247000,  // FCFA mock
  seancesAVenir: 12,      // mock count
  tauxRemplissage: 78,    // % mock
  paiementsAvance: 100,   // % — always 100 by design
}

// ─── Revenue chart data (last 6 months, mock) ─────────────────────────────
export const MOCK_REVENUE_CHART = [
  { month: 'Jan', amount: 145000 },
  { month: 'Fév', amount: 178000 },
  { month: 'Mar', amount: 162000 },
  { month: 'Avr', amount: 210000 },
  { month: 'Mai', amount: 195000 },
  { month: 'Juin', amount: 247000 },
]

// ─── Formatter helpers ────────────────────────────────────────────────────
export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' F'
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
