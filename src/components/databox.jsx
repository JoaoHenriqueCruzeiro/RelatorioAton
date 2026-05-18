import {
  DatePicker,
  DateInput,
  DateSegment,
  Button,
  Calendar,
  CalendarGrid,
  CalendarCell,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  Group,
} from "react-aria-components";

import {
  Calendar as CalendarIcon,
  Clock3,
} from "lucide-react";

import "../styles/dateComponent.css";

export default function DateComponent() {

  return (

    <DatePicker
      className="date-picker"
      granularity="minute"
    >

      <LabelCustom />

      <Group className="date-group">

        <DateInput className="date-input">

          {(segment) => (

            <DateSegment
              segment={segment}
              className="date-segment"
            />

          )}

        </DateInput>

        <Button className="calendar-button">

          <CalendarIcon size={18} />

        </Button>

      </Group>

      <div className="popover-container">

        <Calendar className="calendar">

          <header className="calendar-header">

            <Button
              slot="previous"
              className="nav-btn"
            >
              ←
            </Button>

            <Heading className="calendar-title" />

            <Button
              slot="next"
              className="nav-btn"
            >
              →
            </Button>

          </header>

          <CalendarGrid>

            <CalendarGridHeader>

              {(day) => (

                <CalendarHeaderCell>
                  {day}
                </CalendarHeaderCell>

              )}

            </CalendarGridHeader>

            {(date) => (

              <CalendarCell
                date={date}
                className="calendar-cell"
              />

            )}

          </CalendarGrid>

        </Calendar>

        <div className="time-section">

          <Clock3 size={16} />

          <span>
            Horário habilitado
          </span>

        </div>

      </div>

    </DatePicker>
  );
}

function LabelCustom() {
  return null;
}