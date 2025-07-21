import '@testing-library/jest-dom'
import {
  configMocks,
  mockViewportForTestGroup,
  mockIntersectionObserver,
  mockAnimationsApi,
  mockResizeObserver,
} from 'jsdom-testing-mocks'
import { beforeEach, afterEach, afterAll, vi } from 'vitest'
import { act } from 'react'

vi.useFakeTimers({
  toFake: [
    // vitests defaults
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'setImmediate',
    'clearImmediate',
    'Date',
    // required for mocks
    'performance',
    'requestAnimationFrame',
    'cancelAnimationFrame',
  ],
})

beforeEach(() => {
  window.scrollTo = vi.fn()
})

configMocks({ act })
mockViewportForTestGroup({ width: 1280, height: 720 })
mockAnimationsApi()
mockResizeObserver()
mockIntersectionObserver()

afterAll(() => {
  vi.clearAllMocks()
})
