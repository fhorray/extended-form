"use client"

interface LabelAreaProps {
  label: string
  htmlFor: string
  required?: boolean
}

export const LabelArea = ({ label, htmlFor, required }: LabelAreaProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
}
