import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSlug(text: string) {
  return text
    .toLowerCase()                    // Converte para minúsculas
    .normalize('NFD')                // Normaliza caracteres unicode
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '')   // Remove caracteres especiais
    .trim()                          // Remove espaços no início e fim
    .replace(/\s+/g, '-')           // Substitui espaços por hífens
    .replace(/-+/g, '-');           // Remove hífens duplicados
}