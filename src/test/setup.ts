import { vi } from 'vitest'

// Setup global test configuration
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks()
})

afterEach(() => {
  // Restore system time after each test
  vi.useRealTimers()
})
