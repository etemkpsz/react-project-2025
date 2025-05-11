/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";

import type { ScheduleInstance } from "../../models/schedule";
import type { UserInstance } from "../../models/user";

import FullCalendar from "@fullcalendar/react";

import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

import type { EventInput } from "@fullcalendar/core/index.js";

import "../profileCalendar.scss";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

type CalendarContainerProps = {
  schedule: ScheduleInstance;
  auth: UserInstance;
};

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  staff: any;
  shift: any;
};

type StaffListProps = {
  staffs: any[];
  selectedStaffId: string | null;
  onStaffSelect: (id: string) => void;
  classes: string[];
};

const EventModal = ({ isOpen, onClose, event, staff, shift }: EventModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={e => e.stopPropagation()}>
        <div className="event-modal-header">
          <h3>Etkinlik Detayları</h3>
          <button onClick={onClose} aria-label="Kapat">&times;</button>
        </div>
        <div className="event-modal-content">
          <p><strong>Personel:</strong> {staff?.name}</p>
          <p><strong>Vardiya:</strong> {shift?.name}</p>
          <p><strong>Tarih:</strong> {dayjs(event?.date).format('DD.MM.YYYY')}</p>
          <p><strong>Başlangıç:</strong> {dayjs(event?.date).format('HH:mm')}</p>
          <p><strong>Bitiş:</strong> {dayjs(event?.date).add(1, 'hour').format('HH:mm')}</p>
        </div>
      </div>
    </div>
  );
};

const StaffList = ({ staffs, selectedStaffId, onStaffSelect, classes }: StaffListProps) => (
  <div className="staff-list">
    {staffs?.map((staff: any, index: number) => (
      <div
        key={staff.id}
        onClick={() => onStaffSelect(staff.id)}
        className={`staff ${staff.id === selectedStaffId ? "active" : ""}`}
        style={{ borderColor: classes[index] }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onStaffSelect(staff.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          aria-hidden="true"
        >
          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17-62.5t47-43.5q60-30 124.5-46T480-440q67 0 131.5 16T736-378q30 15 47 43.5t17 62.5v112H160Zm320-400q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Z" />
        </svg>
        <span>{staff.name}</span>
      </div>
    ))}
  </div>
);

const classes = [
  "bg-one",
  "bg-two",
  "bg-three",
  "bg-four",
  "bg-five",
  "bg-six",
  "bg-seven",
  "bg-eight",
  "bg-nine",
  "bg-ten",
  "bg-eleven",
  "bg-twelve",
  "bg-thirteen",
  "bg-fourteen",
  "bg-fifteen",
  "bg-sixteen",
  "bg-seventeen",
  "bg-eighteen",
  "bg-nineteen",
  "bg-twenty",
  "bg-twenty-one",
  "bg-twenty-two",
  "bg-twenty-three",
  "bg-twenty-four",
  "bg-twenty-five",
  "bg-twenty-six",
  "bg-twenty-seven",
  "bg-twenty-eight",
  "bg-twenty-nine",
  "bg-thirty",
  "bg-thirty-one",
  "bg-thirty-two",
  "bg-thirty-three",
  "bg-thirty-four",
  "bg-thirty-five",
  "bg-thirty-six",
  "bg-thirty-seven",
  "bg-thirty-eight",
  "bg-thirty-nine",
  "bg-forty",
];

const CalendarContainer = ({ schedule, auth }: CalendarContainerProps) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [pairDates, setPairDates] = useState<{ [key: string]: string }>({});
  const [initialDate, setInitialDate] = useState<Date>(
    dayjs(schedule?.scheduleStartDate).toDate()
  );

  const getPlugins = () => {
    const plugins = [dayGridPlugin];

    plugins.push(interactionPlugin);
    return plugins;
  };

  const getShiftById = (id: string) => {
    return schedule?.shifts?.find((shift: { id: string }) => id === shift.id);
  };

  const getAssigmentById = (id: string) => {
    return schedule?.assignments?.find((assign) => id === assign.id);
  };

  const getStaffById = (id: string) => {
    return schedule?.staffs?.find((staff) => id === staff.id);
  };

  const validDates = () => {
    const dates = [];
    let currentDate = dayjs(schedule.scheduleStartDate);
    while (
      currentDate.isBefore(schedule.scheduleEndDate) ||
      currentDate.isSame(schedule.scheduleEndDate)
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  };

  const getDatesBetween = (startDate: string, endDate: string) => {
    const dates = [];
    const start = dayjs(startDate, "DD.MM.YYYY").toDate();
    const end = dayjs(endDate, "DD.MM.YYYY").toDate();
    const current = new Date(start);

    while (current <= end) {
      dates.push(dayjs(current).format("DD-MM-YYYY"));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const getPairDates = () => {
    const pairs: { [key: string]: string } = {};
    
    // Seçili personelin pair'lerini bul
    const selectedStaff = schedule?.staffs?.find(staff => staff.id === selectedStaffId);
    if (!selectedStaff?.pairList) return pairs;

    // Her pair için tarih aralığını ve rengi belirle
    selectedStaff.pairList.forEach((pair: any) => {
      const pairStaff = schedule?.staffs?.find(staff => staff.id === pair.staffId);
      if (!pairStaff) return;

      const dates = getDatesBetween(pair.startDate, pair.endDate);
      const staffIndex = schedule?.staffs?.findIndex(staff => staff.id === pair.staffId) || 0;
      const color = classes[staffIndex];

      dates.forEach(date => {
        pairs[date] = color;
      });
    });

    return pairs;
  };

  const generateStaffBasedCalendar = () => {
    const works: EventInput[] = [];

    for (let i = 0; i < schedule?.assignments?.length; i++) {
      if (schedule?.assignments?.[i]?.staffId !== selectedStaffId) continue;

      const className = schedule?.shifts?.findIndex(
        (shift) => shift.id === schedule?.assignments?.[i]?.shiftId
      );

      const assignmentDate = dayjs
        .utc(schedule?.assignments?.[i]?.shiftStart)
        .format("YYYY-MM-DD");
      const isValidDate = validDates().includes(assignmentDate);

      const work = {
        id: schedule?.assignments?.[i]?.id,
        title: getShiftById(schedule?.assignments?.[i]?.shiftId)?.name,
        duration: "01:00",
        date: assignmentDate,
        staffId: schedule?.assignments?.[i]?.staffId,
        shiftId: schedule?.assignments?.[i]?.shiftId,
        className: `event ${classes[className]} ${
          getAssigmentById(schedule?.assignments?.[i]?.id)?.isUpdated
            ? "highlight"
            : ""
        } ${!isValidDate ? "invalid-date" : ""}`,
      };
      works.push(work);
    }

    const offDays = schedule?.staffs?.find(
      (staff) => staff.id === selectedStaffId
    )?.offDays;
    const dates = getDatesBetween(
      dayjs(schedule.scheduleStartDate).format("DD.MM.YYYY"),
      dayjs(schedule.scheduleEndDate).format("DD.MM.YYYY")
    );
    let highlightedDates: string[] = [];

    dates.forEach((date) => {
      const transformedDate = dayjs(date, "DD-MM-YYYY").format("DD.MM.YYYY");
      if (offDays?.includes(transformedDate)) highlightedDates.push(date);
    });

    setHighlightedDates(highlightedDates);
    setEvents(works);
    setPairDates(getPairDates());
  };

  useEffect(() => {
    setSelectedStaffId(schedule?.staffs?.[0]?.id);
    generateStaffBasedCalendar();
  }, [schedule]);

  useEffect(() => {
    generateStaffBasedCalendar();
  }, [selectedStaffId]);

  const RenderEventContent = ({ eventInfo }: any) => {
    return (
      <div className="event-content">
        <p>{eventInfo.event.title}</p>
      </div>
    );
  };

  const handleEventClick = (info: any) => {
    const event = info.event;
    const staff = getStaffById(event.extendedProps.staffId);
    const shift = getShiftById(event.extendedProps.shiftId);
    
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
  };

  return (
    <div className="calendar-section">
      <div className="calendar-wrapper">
        <StaffList
          staffs={schedule?.staffs || []}
          selectedStaffId={selectedStaffId}
          onStaffSelect={handleStaffSelect}
          classes={classes}
        />
        <FullCalendar
          ref={calendarRef}
          locale={auth.language}
          plugins={getPlugins()}
          contentHeight={500}
          handleWindowResize={true}
          selectable={true}
          editable={false}
          eventOverlap={true}
          eventDurationEditable={false}
          initialView="dayGridMonth"
          initialDate={initialDate}
          events={events}
          firstDay={1}
          dayMaxEventRows={4}
          fixedWeekCount={true}
          showNonCurrentDates={true}
          eventClick={handleEventClick}
          eventContent={(eventInfo: any) => (
            <RenderEventContent eventInfo={eventInfo} />
          )}
          datesSet={(info: any) => {
            const prevButton = document.querySelector(
              ".fc-prev-button"
            ) as HTMLButtonElement;
            const nextButton = document.querySelector(
              ".fc-next-button"
            ) as HTMLButtonElement;

            if (
              calendarRef?.current?.getApi().getDate() &&
              !dayjs(schedule?.scheduleStartDate).isSame(
                calendarRef?.current?.getApi().getDate()
              )
            )
              setInitialDate(calendarRef?.current?.getApi().getDate());

            const startDiff = dayjs(info.start)
              .utc()
              .diff(
                dayjs(schedule.scheduleStartDate).subtract(1, "day").utc(),
                "days"
              );
            const endDiff = dayjs(dayjs(schedule.scheduleEndDate)).diff(
              info.end,
              "days"
            );
            if (startDiff < 0 && startDiff > -35) prevButton.disabled = true;
            else prevButton.disabled = false;

            if (endDiff < 0 && endDiff > -32) nextButton.disabled = true;
            else nextButton.disabled = false;
          }}
          dayCellContent={({ date }) => {
            const found = validDates().includes(
              dayjs(date).format("YYYY-MM-DD")
            );
            const isHighlighted = highlightedDates.includes(
              dayjs(date).format("DD-MM-YYYY")
            );
            const formattedDate = dayjs(date).format("DD-MM-YYYY");
            const pairColor = pairDates[formattedDate];

            return (
              <div
                className={`${found ? "" : "date-range-disabled"} ${
                  isHighlighted ? "highlighted-date-orange" : ""
                } ${pairColor ? "highlightedPair" : ""}`}
                style={pairColor ? { borderBottomColor: pairColor } : undefined}
              >
                {dayjs(date).date()}
              </div>
            );
          }}
        />
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        staff={selectedEvent ? getStaffById(selectedEvent.extendedProps.staffId) : null}
        shift={selectedEvent ? getShiftById(selectedEvent.extendedProps.shiftId) : null}
      />
    </div>
  );
};

export default CalendarContainer;
