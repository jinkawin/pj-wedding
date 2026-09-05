export type AgendaEvent = {
  id: string
  time: string
  period: 'morning' | 'evening'
  titleKey: string
  titleDefault: string
  descKey: string
  descDefault: string
  location: string
  icon: string
  attire?: string
  highlight?: boolean
}

export const AGENDA_EVENTS: AgendaEvent[] = [
  {
    id: 'morning-1',
    time: '08:30 - 09:15',
    period: 'morning',
    titleKey: 'agenda.events.khanMaak.title',
    titleDefault: 'Traditional Khan Maak Procession',
    descKey: 'agenda.events.khanMaak.desc',
    descDefault: "Groom's procession with traditional silver and gold gate games, sweet tokens, and blessings.",
    location: 'Grand Ballroom - Outer Court & Foyer',
    icon: '🥁',
    attire: 'Traditional Thai or Formal Morning Attire',
  },
  {
    id: 'morning-2',
    time: '09:19 - 10:00',
    period: 'morning',
    titleKey: 'agenda.events.ringExchange.title',
    titleDefault: 'Auspicious Ring Exchange & Tea Ceremony',
    descKey: 'agenda.events.ringExchange.desc',
    descDefault: 'Formal engagement ceremony, wedding rings exchange, and Chinese tea ceremony honoring parents and elders.',
    location: 'Grand Ballroom - Main Stage',
    icon: '💍',
    highlight: true,
  },
  {
    id: 'morning-3',
    time: '10:00 - 11:00',
    period: 'morning',
    titleKey: 'agenda.events.waterBlessing.title',
    titleDefault: 'Water Pouring Blessing Ceremony (Rod Nam Sang)',
    descKey: 'agenda.events.waterBlessing.desc',
    descDefault: 'Sacred lustral water blessing by honored relatives, mentors, and all beloved guests.',
    location: 'Lotus Pavilion Hall',
    icon: '🌸',
  },
  {
    id: 'morning-4',
    time: '11:15 - 12:30',
    period: 'morning',
    titleKey: 'agenda.events.monksLunch.title',
    titleDefault: 'Family Lunch & Morning Toast',
    descKey: 'agenda.events.monksLunch.desc',
    descDefault: 'Warm celebratory buffet lunch for immediate family, wedding party, and morning attendees.',
    location: 'Garden Courtyard Dining',
    icon: '☕',
  },
  {
    id: 'evening-1',
    time: '17:30 - 18:30',
    period: 'evening',
    titleKey: 'agenda.events.cocktails.title',
    titleDefault: 'Guest Welcome, Signature Cocktails & Photobooth',
    descKey: 'agenda.events.cocktails.desc',
    descDefault: 'Arrival reception, welcome drinks, guestbook signing, and floral photo backdrop snapshots with the couple.',
    location: 'The Grand Ballroom Foyer',
    icon: '🥂',
    attire: 'Formal Evening / Black Tie Optional (Terracotta & Gold Accents)',
  },
  {
    id: 'evening-2',
    time: '18:45 - 19:15',
    period: 'evening',
    titleKey: 'agenda.events.grandEntrance.title',
    titleDefault: 'Grand Entrance & Wedding Vows',
    descKey: 'agenda.events.grandEntrance.desc',
    descDefault: 'Opening cinematic video presentation, grand entrance of Parima & Jinkawin, and exchanging of personal vows.',
    location: 'The Grand Ballroom',
    icon: '✨',
    highlight: true,
  },
  {
    id: 'evening-3',
    time: '19:15 - 20:15',
    period: 'evening',
    titleKey: 'agenda.events.banquet.title',
    titleDefault: 'Dinner Banquet Feast & Heartfelt Speeches',
    descKey: 'agenda.events.banquet.desc',
    descDefault: 'Curated 5-course banquet dinner accompanied by acoustic strings, parental blessings, and best friends’ speeches.',
    location: 'The Grand Ballroom',
    icon: '🍽️',
  },
  {
    id: 'evening-4',
    time: '20:15 - 20:45',
    period: 'evening',
    titleKey: 'agenda.events.cakeCutting.title',
    titleDefault: 'Cake Cutting, Champagne Tower & Bouquet Toss',
    descKey: 'agenda.events.cakeCutting.desc',
    descDefault: 'Symbolic cake cutting, sparkling champagne fountain pour, and the lucky bouquet toss for single guests!',
    location: 'The Grand Ballroom Center Stage',
    icon: '🎂',
    highlight: true,
  },
  {
    id: 'evening-5',
    time: '21:00 - 23:30',
    period: 'evening',
    titleKey: 'agenda.events.afterparty.title',
    titleDefault: 'Afterparty Celebration & Live Band',
    descKey: 'agenda.events.afterparty.desc',
    descDefault: 'Dance floor opens with live jazz band followed by DJ set, midnight snacks, and craft cocktails.',
    location: 'The Ballroom Lounge & Terrace',
    icon: '🎶',
  },
]
