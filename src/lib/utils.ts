import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatDate(date);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("sr-Latn-RS", {
    maximumFractionDigits: 0,
  }).format(amount) + " RSD";
}

/** Returns YYYY-MM-DD for the local date, avoiding UTC-shift bugs from toISOString(). */
export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDateSr(date: string | Date) {
  return new Intl.DateTimeFormat("sr-Latn-RS", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

/** Is "now" past HH:MM cutoff time for the given date-key? Always true for past dates. */
export function isPastCutoff(dateKey: string, cutoffTime: string, now = new Date()) {
  const todayK = toDateKey(now);
  if (dateKey < todayK) return true;
  if (dateKey > todayK) return false;
  const [h, m] = cutoffTime.split(":").map(Number);
  const cutoff = new Date(now);
  cutoff.setHours(h ?? 0, m ?? 0, 0, 0);
  return now.getTime() >= cutoff.getTime();
}
