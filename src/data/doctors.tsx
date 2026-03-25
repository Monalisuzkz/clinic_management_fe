export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Smith",
    specialty: "General Medicine",
    email: "smith@clinic.com",
    phone: "555-0001",
  },
  {
    id: 2,
    name: "Dr. Lee",
    specialty: "Cardiology",
    email: "lee@clinic.com",
    phone: "555-0002",
  },
  {
    id: 3,
    name: "Dr. Williams",
    specialty: "Dermatology",
    email: "williams@clinic.com",
    phone: "555-0003",
  },
  {
    id: 4,
    name: "Dr. Brown",
    specialty: "Pediatrics",
    email: "brown@clinic.com",
    phone: "555-0004",
  },
];
