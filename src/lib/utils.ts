import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function zip<T, U>(a: T[], b: U[]): [T, U][] {
  if (a.length !== b.length) throw new Error("Arrays must be the same length");
  return Array.from({ length: a.length }, (_, i) => [a[i], b[i]]);
}

export function capitalized(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
