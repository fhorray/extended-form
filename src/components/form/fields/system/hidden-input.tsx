"use client"

import { useFieldContext } from "@/contexts/form-context"
import { useEffect } from "react"

interface HiddenInputProps {
  id: string
  value?: string
}

const HiddenInputField = ({ id, value }: HiddenInputProps) => {
  const field = useFieldContext<string>()

  useEffect(() => {
    if (value !== undefined) {
      field.setValue(value)
    }
  }, [value, field])

  return (
    <input id={id} type="hidden" value={field.state.value || ""} onChange={(e) => field.setValue(e.target.value)} />
  )
}

export default HiddenInputField
