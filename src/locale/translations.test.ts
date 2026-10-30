import { describe, it, expect } from 'vitest'
import en from './en/translations.json'
import th from './th/translations.json'
import cn from './cn/translations.json'
import jp from './jp/translations.json'

type Tree = { [key: string]: string | Tree }

const flatten = (tree: Tree, prefix = ''): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string') acc[`${prefix}${key}`] = value
    else Object.assign(acc, flatten(value, `${prefix}${key}.`))

    return acc
  }, {})

const placeholders = (text: string) => (text.match(/{{\s*\w+\s*}}/g) ?? []).map((p) => p.replace(/\s/g, '')).sort()

const base = flatten(en as Tree)
const others = { th, cn, jp } as Record<string, Tree>

describe.each(Object.entries(others))('%s translations', (_code, dict) => {
  const flat = flatten(dict)

  it('has every English key', () => {
    expect(Object.keys(base).filter((k) => !(k in flat))).toEqual([])
  })

  it('has no keys that English lacks', () => {
    expect(Object.keys(flat).filter((k) => !(k in base))).toEqual([])
  })

  it('has no empty values', () => {
    expect(Object.entries(flat).filter(([, v]) => v.trim() === '').map(([k]) => k)).toEqual([])
  })

  it('keeps the same {{placeholders}} as English', () => {
    const mismatched = Object.keys(base).filter(
      (k) => k in flat && placeholders(base[k]).join() !== placeholders(flat[k]).join(),
    )
    expect(mismatched).toEqual([])
  })
})

describe('english translations', () => {
  it('has no empty values', () => {
    expect(Object.entries(base).filter(([, v]) => v.trim() === '')).toEqual([])
  })
})
