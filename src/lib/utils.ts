import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, precision: number = 6): string {
  if (Number.isInteger(num) && Math.abs(num) < 1e15) {
    return num.toLocaleString("en-US");
  }
  const fixed = num.toFixed(precision);
  // Remove trailing zeros after decimal
  const trimmed = fixed.replace(/\.?0+$/, "");
  return trimmed;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
