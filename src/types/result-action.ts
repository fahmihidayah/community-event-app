/**
 * Standard result type for server actions
 * Ensures consistent error handling across all actions
 *
 * @template T - The type of data returned on success
 *
 * @example
 * // Success case
 * { data: attendance, error: null }
 *
 * @example
 * // Error case
 * { data: null, error: "Employee not found" }
 */
export type ResultAction<T> = {
  data: T | null
  error: string | null
}

/**
 * Helper to create a successful result
 */
export const success = <T>(data: T): ResultAction<T> => ({
  data,
  error: null,
})

/**
 * Helper to create an error result
 */
export const failure = <T>(error: string): ResultAction<T> => ({
  data: null,
  error,
})

/**
 * Type guard to check if result is successful
 */
export const isSuccess = <T>(result: ResultAction<T>): result is { data: T; error: null } => {
  return result.error === null && result.data !== null
}

/**
 * Type guard to check if result is failure
 */
export const isFailure = <T>(result: ResultAction<T>): result is { data: null; error: string } => {
  return result.error !== null
}
