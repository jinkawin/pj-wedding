import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import Countdown from './Countdown'
import { I18nProvider } from '@/locale/I18nContext'
import { weddingConfig } from '@/configs/app'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const WEDDING = new Date(weddingConfig.weddingDate).getTime()
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

let container: HTMLDivElement
let root: Root

const render = (now: number) => {
  vi.setSystemTime(now)
  act(() => {
    root.render(
      <I18nProvider>
        <Countdown />
      </I18nProvider>,
    )
  })
}

const values = () => {
  const text = container.querySelector('[aria-live="polite"]')?.textContent ?? ''

  return text.match(/\d{2,}/g)?.map(Number)
}

beforeEach(() => {
  vi.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

describe('Countdown', () => {
  it('splits the remaining time into days, hours, minutes and seconds', () => {
    render(WEDDING - (12 * DAY + 3 * HOUR + 4 * MINUTE + 5 * SECOND))
    expect(values()).toEqual([12, 3, 4, 5])
  })

  it('shows zeros once the wedding has started', () => {
    render(WEDDING + SECOND)
    expect(values()).toEqual([0, 0, 0, 0])
  })

  it('shows zeros exactly at the wedding time', () => {
    render(WEDDING)
    expect(values()).toEqual([0, 0, 0, 0])
  })

  it('rolls over to the next unit just below a boundary', () => {
    render(WEDDING - (DAY - SECOND))
    expect(values()).toEqual([0, 23, 59, 59])
  })

  it('ticks every second', () => {
    render(WEDDING - 10 * SECOND)
    expect(values()).toEqual([0, 0, 0, 10])
    act(() => {
      vi.advanceTimersByTime(3 * SECOND)
    })
    expect(values()).toEqual([0, 0, 0, 7])
  })

  it('stops ticking after unmount', () => {
    render(WEDDING - 10 * SECOND)
    act(() => root.unmount())
    expect(vi.getTimerCount()).toBe(0)
    root = createRoot(container)
  })

  it('shows the date text from config', () => {
    render(WEDDING - DAY)
    expect(container.textContent).toContain(weddingConfig.location.dateTimeText)
  })
})
