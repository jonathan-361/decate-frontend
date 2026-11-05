export type WeekDay = "Lun" | "Mar" | "Mié" | "Jue" | "Vie" | "Sáb";

export type SubjectColor =
  | "blue"
  | "emerald"
  | "amber"
  | "violet"
  | "rose"
  | "sky"
  | "teal"
  | "orange";

export interface Materia {
  id: number;
  name: string;
  professor: string;
  room: string;
  days: WeekDay[];
  startTime: string;
  endTime: string;
  color: SubjectColor;
}