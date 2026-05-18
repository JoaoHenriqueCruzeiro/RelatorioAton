import {
  DatePicker,
  DateInput,
  DateSegment,
  Button,
  Calendar,
  CalendarGrid,
  CalendarGridBody,
  CalendarCell,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  Group,
  Popover,
  Dialog,
} from "react-aria-components";

import { Calendar as CalendarIcon } from "lucide-react";

import {
  parseAbsoluteToLocal,
  getLocalTimeZone,
  now,
} from "@internationalized/date";

import "../styles/dateComponent.css";

export default function DateComponent() {
  return (
    <DatePicker
      granularity="day"
      hideTimeZone
      defaultValue={now(getLocalTimeZone())}
      className="date-picker"
    >
      <Group className="date-group">
        <DateInput className="date-input">
          {(segment) => (
            <DateSegment segment={segment} className="date-segment" />
          )}
        </DateInput>

        <Button className="calendar-button">
          <CalendarIcon size={18} />
        </Button>
      </Group>

      <Popover className="popover">
        <Dialog>
          <Calendar className="calendar">
            <header className="calendar-header">
              <Button slot="previous" className="nav-btn">
                ←
              </Button>

              <Heading className="calendar-title" />

              <Button slot="next" className="nav-btn">
                →
              </Button>
            </header>

            <CalendarGrid>
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>

              <CalendarGridBody>
                {(date) => (
                  <CalendarCell date={date} className="calendar-cell" />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}
