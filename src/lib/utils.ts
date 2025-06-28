import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to clean up markdown formatting
export function cleanMarkdown(text: string): string {
  if (!text) return text;
  
  return text
    // Remove bold formatting (**text** -> text)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove italic formatting (*text* -> text)
    .replace(/\*(.*?)\*/g, '$1')
    // Remove code formatting (`text` -> text)
    .replace(/`(.*?)`/g, '$1')
    // Remove heading formatting (# text -> text)
    .replace(/^#+\s+/gm, '')
    // Remove list formatting (- text -> text)
    .replace(/^[-*+]\s+/gm, '')
    // Remove numbered list formatting (1. text -> text)
    .replace(/^\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}
