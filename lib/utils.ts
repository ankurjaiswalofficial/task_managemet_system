import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTotalHours(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return (end - start) / (1000 * 60 * 60)
}

export function generateTaskId(index: number): string {
  return `T-${String(index + 1).padStart(5, '0')}`
}

