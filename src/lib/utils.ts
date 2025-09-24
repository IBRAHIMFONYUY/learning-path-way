import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function withTimeout<T>(promise: Promise<T>, ms: number, message = 'Operation timed out'): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function retryAsync<T>(fn: () => Promise<T>, options?: { retries?: number; baseDelayMs?: number }): Promise<T> {
  const retries = options?.retries ?? 2;
  const baseDelayMs = options?.baseDelayMs ?? 500;
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise(res => setTimeout(res, delay));
      attempt++;
    }
  }
}
