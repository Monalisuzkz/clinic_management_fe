export interface Appointment {
  id: number;
  patient: string;
  date: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}
