import { Fragment } from "react";
import type { Materia, WeekDay } from "@/modules/schedule/schemas/schedule.schema";
import {
  HOURS,
  ROW_HEIGHT,
  SCHEDULE_DAYS,
  START_HOUR,
  SUBJECT_COLOR_STYLES,
} from "@/modules/schedule/data/mockSchedule";

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

interface WeeklyScheduleGridProps {
  materias: Materia[];
}

export function WeeklyScheduleGrid({ materias }: WeeklyScheduleGridProps) {
  const gridStart = START_HOUR * 60;

  const blocks = materias.flatMap((materia) => {
    const styles = SUBJECT_COLOR_STYLES[materia.color];
    const top = ((toMinutes(materia.startTime) - gridStart) / 60) * ROW_HEIGHT;
    const height =
      ((toMinutes(materia.endTime) - toMinutes(materia.startTime)) / 60) *
      ROW_HEIGHT;

    return materia.days
      .filter((day): day is WeekDay => SCHEDULE_DAYS.includes(day))
      .map((day) => {
        const dayIndex = SCHEDULE_DAYS.indexOf(day);
        return {
          key: `${materia.id}-${day}`,
          top,
          height: height - 4,
          left: `calc(${(dayIndex / SCHEDULE_DAYS.length) * 100}% + 4px)`,
          width: `calc(${100 / SCHEDULE_DAYS.length}% - 8px)`,
          name: materia.name,
          time: `${materia.startTime}–${materia.endTime}`,
          room: materia.room,
          tint: styles.tint,
          bar: styles.bar,
        };
      });
  });

  return (
    <div className="border border-border rounded-none overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Day header */}
          <div className="grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))] bg-muted border-b border-border">
            <div aria-hidden="true" />
            {SCHEDULE_DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-2.5 text-center text-xs font-semibold tracking-wider uppercase text-muted-foreground border-l border-border"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Hour rows */}
          <div className="relative grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))]">
            {HOURS.map((hour) => (
              <Fragment key={hour}>
                <div
                  className="border-b border-border flex items-start justify-end pr-2 pt-1.5"
                  style={{ height: ROW_HEIGHT }}
                >
                  <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>
                {SCHEDULE_DAYS.map((day) => (
                  <div
                    key={day}
                    className="border-b border-l border-border"
                    style={{ height: ROW_HEIGHT }}
                  />
                ))}
              </Fragment>
            ))}

            {/* Class blocks overlay */}
            <div className="absolute inset-y-0 left-14 right-0">
              {blocks.map((block) => (
                <div
                  key={block.key}
                  className={`absolute border border-border rounded-none p-1.5 pl-2.5 overflow-hidden transition-colors hover:border-foreground/30 ${block.tint}`}
                  style={{
                    top: block.top,
                    height: block.height,
                    left: block.left,
                    width: block.width,
                  }}
                >
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-0.5 ${block.bar}`}
                    aria-hidden="true"
                  />
                  <p className="text-xs font-medium leading-snug text-foreground truncate">
                    {block.name}
                  </p>
                  <p className="text-[10px] leading-tight text-muted-foreground truncate">
                    {block.time} · {block.room}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}