/** Anything this SDK throws for a failed call. `status` is 0 when no answer arrived. */
export class SuperAgentOSError extends Error {
  readonly status: number
  /** Stable and machine-readable; `message` is for a person. */
  readonly code: string
  /** Seconds the API asked to wait. */
  readonly retryAfter?: number
  /** Everything else the API said, e.g. `fix` or `approvalUrl`. */
  readonly details: Record<string, unknown>

  constructor(
    status: number,
    code: string,
    message: string,
    retryAfter?: number,
    details: Record<string, unknown> = {},
    options?: ErrorOptions,
  ) {
    super(message, options)
    this.name = new.target.name
    this.status = status
    this.code = code
    if (retryAfter !== undefined) this.retryAfter = retryAfter
    this.details = details
  }
}

export class InvalidArgumentsError extends SuperAgentOSError {}
export class AuthenticationError extends SuperAgentOSError {}
export class PlanLimitError extends SuperAgentOSError {}
export class PermissionError extends SuperAgentOSError {}
export class ScopeRequiredError extends SuperAgentOSError {}
export class NotFoundError extends SuperAgentOSError {}
export class ConflictError extends SuperAgentOSError {}
export class PayloadTooLargeError extends SuperAgentOSError {}
export class RateLimitError extends SuperAgentOSError {}
export class InternalError extends SuperAgentOSError {}
/** The request never got an answer. */
export class ConnectionError extends SuperAgentOSError {}
export class TimeoutError extends SuperAgentOSError {}

function errorClass(status: number, code: string): typeof SuperAgentOSError {
  if (status >= 500) return InternalError
  if (status === 403) return code === 'scope_required' ? ScopeRequiredError : PermissionError
  const byStatus: Record<number, typeof SuperAgentOSError> = {
    400: InvalidArgumentsError,
    401: AuthenticationError,
    402: PlanLimitError,
    404: NotFoundError,
    409: ConflictError,
    413: PayloadTooLargeError,
    422: InvalidArgumentsError,
    429: RateLimitError,
  }
  return byStatus[status] ?? SuperAgentOSError
}

/** The error for an HTTP refusal. `text` may be anything: a proxy's HTML page is not `{error}`. */
export function errorFor(
  status: number,
  text: string,
  retryAfterHeader: string | null,
): SuperAgentOSError {
  let error: Record<string, unknown> = {}
  try {
    const parsed = JSON.parse(text) as { error?: unknown } | null
    if (typeof parsed?.error === 'object' && parsed.error !== null) {
      error = parsed.error as Record<string, unknown>
    }
  } catch {
    // Not JSON: status alone decides the class, and the message says what arrived.
  }
  const { code, message, retryAfterSeconds, ...details } = error
  const named = typeof code === 'string' ? code : 'http_error'
  const seconds = Number(retryAfterHeader ?? retryAfterSeconds)
  const retryAfter =
    (retryAfterHeader !== null || retryAfterSeconds !== undefined) && Number.isFinite(seconds)
      ? seconds
      : undefined
  return new (errorClass(status, named))(
    status,
    named,
    typeof message === 'string' ? message : `The API answered ${status} without an error body.`,
    retryAfter,
    details,
  )
}
