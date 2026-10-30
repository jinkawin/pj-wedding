import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { SEATING_TABLES, searchGuests } from './seatingData'
import { AGENDA_EVENTS } from './agendaData'
import { GALLERY_ITEMS, TIMELINE_YEARS } from './galleryData'

const unique = <T>(items: T[]) => new Set(items).size === items.length

describe('seating data integrity', () => {
  it('has unique table ids', () => {
    expect(unique(SEATING_TABLES.map((t) => t.id))).toBe(true)
  })

  it.each(SEATING_TABLES.map((t) => [t.name, t] as const))('%s fits within its capacity', (_name, table) => {
    expect(table.guests.length).toBeLessThanOrEqual(table.capacity)
    expect(unique(table.guests.map((g) => g.seatNumber))).toBe(true)
    for (const seat of table.guests) {
      expect(seat.seatNumber).toBeGreaterThanOrEqual(1)
      expect(seat.seatNumber).toBeLessThanOrEqual(table.capacity)
    }
  })

  it('places every table inside the 0-100 floor plan', () => {
    for (const t of SEATING_TABLES) {
      expect(t.x).toBeGreaterThanOrEqual(0)
      expect(t.x).toBeLessThanOrEqual(100)
      expect(t.y).toBeGreaterThanOrEqual(0)
      expect(t.y).toBeLessThanOrEqual(100)
    }
  })

  it('has no guest seated twice', () => {
    const names = SEATING_TABLES.flatMap((t) => t.guests.map((g) => g.guestName))
    expect(unique(names)).toBe(true)
  })
})

describe('searchGuests', () => {
  const first = SEATING_TABLES[0]
  const seat = first.guests[0]

  it('returns nothing for empty or whitespace queries', () => {
    expect(searchGuests('')).toEqual([])
    expect(searchGuests('   ')).toEqual([])
  })

  it('finds a guest by name, ignoring case and surrounding spaces', () => {
    const results = searchGuests(`  ${seat.guestName.toUpperCase()}  `)
    expect(results).toContainEqual({ table: first, seat })
  })

  it('finds a guest by relationship', () => {
    const withRelation = first.guests.find((g) => g.relationship)!
    const results = searchGuests(withRelation.relationship!.toLowerCase())
    expect(results.map((r) => r.seat)).toContain(withRelation)
  })

  it('returns every guest of a table when searching its name', () => {
    const results = searchGuests(first.name)
    expect(results.map((r) => r.seat)).toEqual(first.guests)
    expect(results.every((r) => r.table === first)).toBe(true)
  })

  it('returns an empty list when nothing matches', () => {
    expect(searchGuests('zzzz-nobody-zzzz')).toEqual([])
  })

  it('pairs each result with the table it belongs to', () => {
    for (const { table, seat: s } of searchGuests('a')) {
      expect(table.guests).toContain(s)
    }
  })
})

describe('agenda data', () => {
  it('has unique ids and non-empty text', () => {
    expect(unique(AGENDA_EVENTS.map((e) => e.id))).toBe(true)
    for (const e of AGENDA_EVENTS) {
      expect(e.titleDefault).not.toBe('')
      expect(e.descDefault).not.toBe('')
    }
  })

  it('formats times as HH:MM - HH:MM with start before end', () => {
    for (const e of AGENDA_EVENTS) {
      const match = e.time.match(/^(\d{2}):(\d{2}) - (\d{2}):(\d{2})$/)
      expect(match, e.id).not.toBeNull()
      const [, h1, m1, h2, m2] = match!.map(Number)
      expect(h1 * 60 + m1, e.id).toBeLessThan(h2 * 60 + m2)
    }
  })

  it('keeps events in chronological order and morning before evening', () => {
    const starts = AGENDA_EVENTS.map((e) => e.time.slice(0, 5))
    expect(starts).toEqual([...starts].sort())
    const firstEvening = AGENDA_EVENTS.findIndex((e) => e.period === 'evening')
    expect(AGENDA_EVENTS.slice(firstEvening).every((e) => e.period === 'evening')).toBe(true)
  })
})

describe('gallery data', () => {
  it('has unique ids', () => {
    expect(unique(GALLERY_ITEMS.map((i) => i.id))).toBe(true)
  })

  it('has an https or existing public image source and complete copy', () => {
    for (const item of GALLERY_ITEMS) {
      const isRemote = item.src.startsWith('https://')
      const isLocal = item.src.startsWith('/') && existsSync(join(process.cwd(), 'public', item.src))
      expect(isRemote || isLocal, `${item.id} src ${item.src}`).toBe(true)
      expect(item.title, item.id).not.toBe('')
      expect(item.story, item.id).not.toBe('')
    }
  })

  it('TIMELINE_YEARS is the sorted unique set of item years', () => {
    expect(TIMELINE_YEARS).toEqual([...new Set(GALLERY_ITEMS.map((i) => i.year))].sort((a, b) => a - b))
  })

  it('date text mentions the item year', () => {
    for (const item of GALLERY_ITEMS) expect(item.date, item.id).toContain(String(item.year))
  })
})
