import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format INR with Indian numbering (lakhs / crores). */
export function formatINR(value: number, compact = false): string {
  if (!Number.isFinite(value)) return "₹0";

  if (compact) {
    const abs = Math.abs(value);
    if (abs >= 1_00_00_000) {
      return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
    }
    if (abs >= 1_00_000) {
      return `₹${(value / 1_00_000).toFixed(2)} L`;
    }
    if (abs >= 1_000) {
      return `₹${(value / 1_000).toFixed(1)} K`;
    }
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(digits)}%`;
}

export function formatNumber(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(value);
}
