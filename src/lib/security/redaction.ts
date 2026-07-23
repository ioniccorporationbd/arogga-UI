const SENSITIVE = /(api[_-]?key|secret|password|token|authorization|otp|cookie|session)/i;
export function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSensitive);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, SENSITIVE.test(k) ? "[REDACTED]" : redactSensitive(v)]));
  return value;
}
