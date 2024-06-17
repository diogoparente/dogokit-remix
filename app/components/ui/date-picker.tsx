import { useInputEvent, type FieldConfig } from "@conform-to/react"
import { useEffect, useRef, useState } from "react"
import { type SelectSingleEventHandler } from "react-day-picker"

import { IconMatch } from "~/components/libs/icon"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { cn } from "~/utils/cn"
import { formatDateDMY } from "~/utils/datetime"

export function DatePicker({
  className,
  onChange,
  yearPast = 100,
  yearFuture = 20,
  toYear,
  ...props
}: {
  onChange: (value: Date) => void
  className: string
  toYear?: number
  yearPast?: number
  yearFuture?: number
} & FieldConfig<string>) {
  const defaultDate =
    props.defaultValue && props.defaultValue !== "Invalid Date"
      ? new Date(props.defaultValue)
      : new Date()

  const [date, setDate] = useState<Date>(defaultDate)
  const shadowInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onChange(date)
  }, [date, onChange])

  const control = useInputEvent({
    ref: shadowInputRef,
    onFocus: () => shadowInputRef.current?.focus(),
    onReset: () => setDate(defaultDate),
  })

  return (
    <div>
      <Popover>
        <input
          type="hidden"
          required={props.required}
          name={props.name}
          value={String(date)}
          onChange={event => {
            control.change(event.target.value)
            setDate(new Date(event.target.value))
          }}
        />

        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 justify-start gap-2 border-input p-2 text-left font-normal",
              !date && "text-primary-foreground",
              className,
            )}
          >
            <IconMatch icon="calendar-blank" className="size-5" />
            {date ? formatDateDMY(date) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            initialFocus
            mode="single"
            selected={date}
            onSelect={setDate as SelectSingleEventHandler}
            defaultMonth={date}
            yearPast={yearPast}
            yearFuture={yearFuture}
            toYear={toYear}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
