"use client"

import type { ReactNode } from "react"

interface FieldWrapperProps {
  children: ReactNode
}

export const FieldWrapper = ({ children }: FieldWrapperProps) => {
  return <div className="grid gap-1.5 w-full">{children}</div>
}
