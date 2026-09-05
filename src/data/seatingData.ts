export type Seat = {
  seatNumber: number
  guestName: string
  relationship?: string
}

export type TableCategory = 'vip' | 'bride_family' | 'groom_family' | 'friends' | 'colleagues'

export type Table = {
  id: number
  name: string
  category: TableCategory
  categoryLabel: string
  x: number // percentage 0-100 across ballroom width
  y: number // percentage 0-100 across ballroom depth
  capacity: number
  guests: Seat[]
}

export const SEATING_TABLES: Table[] = [
  {
    id: 1,
    name: 'Table 1 (VIP & Parents)',
    category: 'vip',
    categoryLabel: 'VIP & Parents',
    x: 50,
    y: 18,
    capacity: 8,
    guests: [
      { seatNumber: 1, guestName: 'Somchai S.', relationship: "Bride's Father" },
      { seatNumber: 2, guestName: 'Wanida S.', relationship: "Bride's Mother" },
      { seatNumber: 3, guestName: 'Prasert P.', relationship: "Groom's Father" },
      { seatNumber: 4, guestName: 'Chintana P.', relationship: "Groom's Mother" },
      { seatNumber: 5, guestName: 'Grandmother Mali', relationship: 'Honored Elder' },
      { seatNumber: 6, guestName: 'Grandfather Boon', relationship: 'Honored Elder' },
      { seatNumber: 7, guestName: 'Uncle Chavalit', relationship: 'Family Representative' },
      { seatNumber: 8, guestName: 'Aunt Pornsiri', relationship: 'Family Representative' },
    ],
  },
  {
    id: 2,
    name: "Table 2 (Bride's Family)",
    category: 'bride_family',
    categoryLabel: "Bride's Family",
    x: 25,
    y: 35,
    capacity: 8,
    guests: [
      { seatNumber: 1, guestName: 'Piyawat S.', relationship: "Bride's Brother" },
      { seatNumber: 2, guestName: 'Narumon K.', relationship: 'Sister-in-law' },
      { seatNumber: 3, guestName: 'Aunt Apsara', relationship: 'Maternal Aunt' },
      { seatNumber: 4, guestName: 'Uncle Narong', relationship: 'Maternal Uncle' },
      { seatNumber: 5, guestName: 'Kornkanok S.', relationship: 'Cousin' },
      { seatNumber: 6, guestName: 'Tanawat S.', relationship: 'Cousin' },
      { seatNumber: 7, guestName: 'Praewa S.', relationship: 'Niece' },
      { seatNumber: 8, guestName: 'Supachai L.', relationship: 'Family Friend' },
    ],
  },
  {
    id: 3,
    name: "Table 3 (Groom's Family)",
    category: 'groom_family',
    categoryLabel: "Groom's Family",
    x: 75,
    y: 35,
    capacity: 8,
    guests: [
      { seatNumber: 1, guestName: 'Jirayu P.', relationship: "Groom's Brother" },
      { seatNumber: 2, guestName: 'Kanyarat M.', relationship: 'Sister-in-law' },
      { seatNumber: 3, guestName: 'Uncle Weera', relationship: 'Paternal Uncle' },
      { seatNumber: 4, guestName: 'Aunt Somjit', relationship: 'Paternal Aunt' },
      { seatNumber: 5, guestName: 'Peeradon P.', relationship: 'Cousin' },
      { seatNumber: 6, guestName: 'Natamon P.', relationship: 'Cousin' },
      { seatNumber: 7, guestName: 'Kittisak V.', relationship: 'Family Friend' },
      { seatNumber: 8, guestName: 'Siriporn V.', relationship: 'Family Friend' },
    ],
  },
  {
    id: 4,
    name: 'Table 4 (Chula University Friends)',
    category: 'friends',
    categoryLabel: 'University Friends',
    x: 25,
    y: 55,
    capacity: 8,
    guests: [
      { seatNumber: 1, guestName: 'Nichaphat (Ploy)', relationship: 'Architecture Alum' },
      { seatNumber: 2, guestName: 'Thanapob (Tor)', relationship: 'Design Classmate' },
      { seatNumber: 3, guestName: 'Krit (Pond)', relationship: 'Studio Partner' },
      { seatNumber: 4, guestName: 'Chananya (Mint)', relationship: 'Close Friend' },
      { seatNumber: 5, guestName: 'Pattadon (Fiat)', relationship: 'University Friend' },
      { seatNumber: 6, guestName: 'Worranit (Mook)', relationship: 'Art Guild Friend' },
      { seatNumber: 7, guestName: 'Tawan (Tay)', relationship: 'Alumni Group' },
      { seatNumber: 8, guestName: 'Thitipoom (New)', relationship: 'Alumni Group' },
    ],
  },
  {
    id: 5,
    name: 'Table 5 (Tech & Startup Friends)',
    category: 'friends',
    categoryLabel: 'Tech Friends',
    x: 75,
    y: 55,
    capacity: 8,
    guests: [
      { seatNumber: 1, guestName: 'Vasin (Beam)', relationship: 'Engineering Buddy' },
      { seatNumber: 2, guestName: 'Chonlatee (Bank)', relationship: 'Hackathon Partner' },
      { seatNumber: 3, guestName: 'Arisara (Grace)', relationship: 'Tech Lead Friend' },
      { seatNumber: 4, guestName: 'Natapohn (Taew)', relationship: 'Developer Friend' },
      { seatNumber: 5, guestName: 'Korn (Ken)', relationship: 'Startup Co-founder' },
      { seatNumber: 6, guestName: 'Sirin (Cris)', relationship: 'Product Manager' },
      { seatNumber: 7, guestName: 'Pakorn (Boy)', relationship: 'Photography Club' },
      { seatNumber: 8, guestName: 'Ranee (Bella)', relationship: 'Photography Club' },
    ],
  },
  {
    id: 6,
    name: 'Table 6 (Creative Studio Colleagues)',
    category: 'colleagues',
    categoryLabel: 'Creative Colleagues',
    x: 35,
    y: 75,
    capacity: 8,
    guests: [
      { seatNumber: 1, guestName: 'Elena Rostova', relationship: 'Art Director' },
      { seatNumber: 2, guestName: 'David Chen', relationship: 'Brand Strategist' },
      { seatNumber: 3, guestName: 'Mayuko Tanaka', relationship: 'Illustrator' },
      { seatNumber: 4, guestName: 'Liam O’Connor', relationship: 'Copywriter' },
      { seatNumber: 5, guestName: 'Pimchanok L.', relationship: 'Senior Designer' },
      { seatNumber: 6, guestName: 'Ananda E.', relationship: 'Motion Artist' },
      { seatNumber: 7, guestName: 'Chutimon C.', relationship: 'UX Researcher' },
      { seatNumber: 8, guestName: 'Sunny Suwan', relationship: 'Creative Director' },
    ],
  },
  {
    id: 7,
    name: 'Table 7 (Engineering & Research Team)',
    category: 'colleagues',
    categoryLabel: 'Tech Colleagues',
    x: 65,
    y: 75,
    capacity: 8,
    guests: [
      { seatNumber: 1, guestName: 'Dr. Arthur Pendelton', relationship: 'Research Advisor' },
      { seatNumber: 2, guestName: 'Sophie Dubois', relationship: 'AI Engineer' },
      { seatNumber: 3, guestName: 'Marcus Vance', relationship: 'Systems Architect' },
      { seatNumber: 4, guestName: 'Linnea Lindholm', relationship: 'DevOps Lead' },
      { seatNumber: 5, guestName: 'Teeradon S.', relationship: 'Fullstack Dev' },
      { seatNumber: 6, guestName: 'Pitchapa P.', relationship: 'Frontend Engineer' },
      { seatNumber: 7, guestName: 'Natthawat R.', relationship: 'Data Scientist' },
      { seatNumber: 8, guestName: 'Supassra T.', relationship: 'QA Specialist' },
    ],
  },
  {
    id: 8,
    name: 'Table 8 (High School & Youth Friends)',
    category: 'friends',
    categoryLabel: 'Youth Friends',
    x: 50,
    y: 90,
    capacity: 8,
    guests: [
      { seatNumber: 1, guestName: 'Jirayu (James)', relationship: 'Childhood Friend' },
      { seatNumber: 2, guestName: 'Urassaya (Yaya)', relationship: 'High School Friend' },
      { seatNumber: 3, guestName: 'Nadech K.', relationship: 'Sports Teammate' },
      { seatNumber: 4, guestName: 'Davika (Mai)', relationship: 'Neighborhood Friend' },
      { seatNumber: 5, guestName: 'Mario M.', relationship: 'Music Band Friend' },
      { seatNumber: 6, guestName: 'Baifern P.', relationship: 'Drama Club Friend' },
      { seatNumber: 7, guestName: 'Nonkul C.', relationship: 'Debate Club' },
      { seatNumber: 8, guestName: 'Violette W.', relationship: 'Choir Group' },
    ],
  },
]

export type SearchResult = {
  table: Table
  seat: Seat
}

export function searchGuests(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SearchResult[] = []

  for (const table of SEATING_TABLES) {
    for (const seat of table.guests) {
      if (
        seat.guestName.toLowerCase().includes(q) ||
        (seat.relationship && seat.relationship.toLowerCase().includes(q)) ||
        table.name.toLowerCase().includes(q)
      ) {
        results.push({ table, seat })
      }
    }
  }

  return results
}
