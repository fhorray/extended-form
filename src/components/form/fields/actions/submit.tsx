"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { ReactNode } from "react"

interface SubmitButtonProps {
  children: ReactNode
  disabled?: boolean
  className?: string
}

export const SubmitButton = ({ children, disabled, className }: SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={disabled} className={className}>
      {disabled ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  )
}
