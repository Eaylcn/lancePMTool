export const PREMIUM_REQUIRED_ERROR = "PREMIUM_REQUIRED";

export class PremiumRequiredError extends Error {
  constructor(message = PREMIUM_REQUIRED_ERROR) {
    super(message);
    this.name = "PremiumRequiredError";
  }
}

export function isPremiumRequiredError(err: unknown): boolean {
  if (err instanceof PremiumRequiredError) return true;
  if (err instanceof Error) {
    return err.message.includes(PREMIUM_REQUIRED_ERROR);
  }
  return false;
}

export async function aiFetch(
  input: string,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 402) {
    emitPremiumRequired();
    throw new PremiumRequiredError();
  }
  return res;
}

const PREMIUM_EVENT = "premium-required";

export function emitPremiumRequired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PREMIUM_EVENT));
  }
}

export function onPremiumRequired(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(PREMIUM_EVENT, handler);
  return () => window.removeEventListener(PREMIUM_EVENT, handler);
}
