import * as React from "react"
import { DayPicker } from "react-day-picker"

import { IconMatch } from "~/components/libs/icon"
import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/utils/cn"

const CALENDAR_YEAR_PAST = 100
const CALENDAR_YEAR_FUTURE = 10

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  yearPast?: number
  yearFuture?: number
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fixedWeeks = true,
  yearPast = CALENDAR_YEAR_PAST,
  yearFuture = CALENDAR_YEAR_FUTURE,
  ISOWeek = true,
  toYear,
  ...props
}: CalendarProps) {
  const today = new Date()
  const fromYear = today.getFullYear() - yearPast
  const modToYear = toYear ?? today.getFullYear() + yearFuture

  return (
    <DayPicker
      captionLayout="dropdown-buttons"
      ISOWeek={ISOWeek}
      fixedWeeks={fixedWeeks}
      showOutsideDays={showOutsideDays}
      fromYear={fromYear}
      toYear={modToYear}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden text-sm font-semibold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(buttonVariants({ variant: "outline" }), "size-7 bg-transparent p-0"),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-primary-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-secondary first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative rounded-md focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100",
        ),
        day_selected:
          "bg-primary rounded-md text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_outside: "text-primary-foreground opacity-50",
        day_disabled: "text-primary-foreground opacity-50",
        day_range_middle: "aria-selected:bg-secondary aria-selected:text-secondary-foreground",
        day_hidden: "invisible",
        vhidden: "hidden",
        caption_dropdowns: "flex flex-nowrap gap-1",
        dropdown_month: "w-[100px]",
        dropdown_year: "w-[65px]",
        dropdown: cn(
          "p-1 cursor-pointer flex w-full rounded-md bg-background text-sm transition-colors",
          "border-none ",
        ),

        ...classNames,
      }}
      components={{
        IconLeft: () => <IconMatch icon="caret-left" className="size-4" />,
        IconRight: () => <IconMatch icon="caret-right" className="size-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
