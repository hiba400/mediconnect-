export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  city: string;
  languages: string[];
  rating: number;
  reviews: number;
  experience: number;
  bio: string;
  price: number;
  avatar: string;
  available: boolean;
  nextSlot: string;
  verified: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled" | "pending";
  type: "video" | "in-person";
  reason?: string;
}

export interface Application {
  id: string;
  name: string;
  specialty: string;
  city: string;
  experience: number;
  email: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  documents: number;
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  role: "patient" | "doctor";
}

const specialties = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Psychiatry",
  "Orthopedics",
  "General Medicine",
  "Endocrinology",
  "Oncology",
  "Ophthalmology",
];
const cities = ["Paris", "London", "New York", "Berlin", "Madrid", "Lisbon", "Amsterdam"];
const langs = ["English", "French", "Spanish", "German", "Arabic", "Portuguese"];
const firstNames = ["Emma", "James", "Olivia", "Noah", "Sophia", "Liam", "Ava", "Lucas", "Mia", "Ethan", "Isabella", "Mason"];
const lastNames = ["Carter", "Bennett", "Hughes", "Reyes", "Walker", "Brooks", "Adams", "Cooper", "Morgan", "Patel", "Nguyen", "Khan"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const doctors: Doctor[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `dr-${i + 1}`,
  name: `Dr. ${pick(firstNames, i + 3)} ${pick(lastNames, i)}`,
  specialty: pick(specialties, i),
  city: pick(cities, i),
  languages: [pick(langs, i), pick(langs, i + 2)],
  rating: 4.3 + ((i * 7) % 7) / 10,
  reviews: 40 + ((i * 31) % 280),
  experience: 5 + (i % 20),
  bio: "Board-certified specialist with a patient-first approach, blending evidence-based medicine with empathetic care.",
  price: 45 + (i % 6) * 15,
  avatar: `https://i.pravatar.cc/200?img=${(i % 60) + 10}`,
  available: i % 3 !== 0,
  nextSlot: ["Today 14:30", "Tomorrow 09:00", "Wed 11:15", "Thu 16:00"][i % 4],
  verified: true,
}));

export const upcomingAppointments: Appointment[] = [
  { id: "a1", doctorName: "Dr. Emma Bennett", doctorSpecialty: "Cardiology", patientName: "Sarah Mitchell", date: "2026-05-14", time: "10:30", status: "upcoming", type: "video", reason: "Follow-up consultation" },
  { id: "a2", doctorName: "Dr. Liam Reyes", doctorSpecialty: "Dermatology", patientName: "Sarah Mitchell", date: "2026-05-19", time: "15:00", status: "upcoming", type: "in-person", reason: "Skin check" },
  { id: "a3", doctorName: "Dr. Olivia Hughes", doctorSpecialty: "Neurology", patientName: "Sarah Mitchell", date: "2026-05-28", time: "09:15", status: "pending", type: "video" },
];

export const pastAppointments: Appointment[] = [
  { id: "p1", doctorName: "Dr. Noah Walker", doctorSpecialty: "General Medicine", patientName: "Sarah Mitchell", date: "2026-04-21", time: "11:00", status: "completed", type: "video" },
  { id: "p2", doctorName: "Dr. Ava Adams", doctorSpecialty: "Pediatrics", patientName: "Sarah Mitchell", date: "2026-03-12", time: "14:30", status: "completed", type: "in-person" },
];

export const doctorAppointments: Appointment[] = [
  { id: "da1", doctorName: "Dr. James Carter", doctorSpecialty: "Cardiology", patientName: "Marcus Lee", date: "2026-05-12", time: "09:00", status: "upcoming", type: "video", reason: "Chest pain follow-up" },
  { id: "da2", doctorName: "Dr. James Carter", doctorSpecialty: "Cardiology", patientName: "Helena Ortiz", date: "2026-05-12", time: "10:30", status: "upcoming", type: "in-person" },
  { id: "da3", doctorName: "Dr. James Carter", doctorSpecialty: "Cardiology", patientName: "Yuki Tanaka", date: "2026-05-12", time: "14:00", status: "pending", type: "video", reason: "Initial consult" },
  { id: "da4", doctorName: "Dr. James Carter", doctorSpecialty: "Cardiology", patientName: "Omar Haddad", date: "2026-05-13", time: "11:00", status: "upcoming", type: "video" },
  { id: "da5", doctorName: "Dr. James Carter", doctorSpecialty: "Cardiology", patientName: "Priya Shah", date: "2026-05-13", time: "16:30", status: "upcoming", type: "in-person", reason: "Annual review" },
];

export const applications: Application[] = [
  { id: "ap1", name: "Dr. Mia Cooper", specialty: "Endocrinology", city: "Berlin", experience: 12, email: "m.cooper@mail.com", submittedAt: "2026-05-08", status: "pending", documents: 4 },
  { id: "ap2", name: "Dr. Ethan Brooks", specialty: "Psychiatry", city: "Paris", experience: 8, email: "e.brooks@mail.com", submittedAt: "2026-05-09", status: "pending", documents: 3 },
  { id: "ap3", name: "Dr. Isabella Morgan", specialty: "Pediatrics", city: "Lisbon", experience: 15, email: "i.morgan@mail.com", submittedAt: "2026-05-07", status: "approved", documents: 5 },
  { id: "ap4", name: "Dr. Mason Patel", specialty: "Orthopedics", city: "London", experience: 6, email: "m.patel@mail.com", submittedAt: "2026-05-06", status: "rejected", documents: 2 },
  { id: "ap5", name: "Dr. Sophia Nguyen", specialty: "Oncology", city: "Amsterdam", experience: 18, email: "s.nguyen@mail.com", submittedAt: "2026-05-10", status: "pending", documents: 5 },
];

export const adminUsers = [
  { id: "u1", name: "Sarah Mitchell", email: "sarah@demo.com", role: "patient", joined: "2026-02-12", status: "active" },
  { id: "u2", name: "Dr. James Carter", email: "j.carter@demo.com", role: "doctor", joined: "2025-11-04", status: "active" },
  { id: "u3", name: "Marcus Lee", email: "m.lee@mail.com", role: "patient", joined: "2026-04-01", status: "active" },
  { id: "u4", name: "Dr. Olivia Hughes", email: "o.hughes@mail.com", role: "doctor", joined: "2025-09-22", status: "active" },
  { id: "u5", name: "Helena Ortiz", email: "h.ortiz@mail.com", role: "patient", joined: "2026-03-18", status: "suspended" },
  { id: "u6", name: "Dr. Noah Walker", email: "n.walker@mail.com", role: "doctor", joined: "2025-07-15", status: "active" },
];

export const chatThreads: ChatThread[] = [
  { id: "t1", name: "Dr. Emma Bennett", avatar: "https://i.pravatar.cc/100?img=12", lastMessage: "Your test results look great. Let's schedule a follow-up.", time: "2m", unread: 2, online: true, role: "doctor" },
  { id: "t2", name: "Dr. Liam Reyes", avatar: "https://i.pravatar.cc/100?img=15", lastMessage: "Apply the cream twice daily for 7 days.", time: "1h", unread: 0, online: false, role: "doctor" },
  { id: "t3", name: "Dr. Olivia Hughes", avatar: "https://i.pravatar.cc/100?img=20", lastMessage: "Please share the MRI image when you can.", time: "Yesterday", unread: 0, online: true, role: "doctor" },
  { id: "t4", name: "Dr. Noah Walker", avatar: "https://i.pravatar.cc/100?img=33", lastMessage: "All clear — see you next year!", time: "3d", unread: 0, online: false, role: "doctor" },
];

export const doctorChatThreads: ChatThread[] = [
  { id: "pt1", name: "Marcus Lee", avatar: "https://i.pravatar.cc/100?img=51", lastMessage: "Thanks doctor, feeling much better.", time: "5m", unread: 1, online: true, role: "patient" },
  { id: "pt2", name: "Helena Ortiz", avatar: "https://i.pravatar.cc/100?img=45", lastMessage: "Should I continue the medication?", time: "30m", unread: 3, online: true, role: "patient" },
  { id: "pt3", name: "Yuki Tanaka", avatar: "https://i.pravatar.cc/100?img=47", lastMessage: "Uploaded my latest blood work.", time: "2h", unread: 0, online: false, role: "patient" },
  { id: "pt4", name: "Priya Shah", avatar: "https://i.pravatar.cc/100?img=48", lastMessage: "See you on Wednesday.", time: "1d", unread: 0, online: false, role: "patient" },
];

export const messages = [
  { id: 1, from: "them", text: "Hi Sarah, I've reviewed your latest blood work.", time: "10:24" },
  { id: 2, from: "them", text: "Everything looks within normal range — your iron levels are back to healthy.", time: "10:24" },
  { id: 3, from: "me", text: "That's amazing news, thank you doctor!", time: "10:26" },
  { id: 4, from: "me", text: "Should I continue the supplements?", time: "10:26" },
  { id: 5, from: "them", text: "Yes, keep them for another 4 weeks then we'll reassess.", time: "10:28" },
  { id: 6, from: "them", text: "Your test results look great. Let's schedule a follow-up.", time: "10:30" },
];

export const analytics = {
  weeklyAppointments: [
    { day: "Mon", count: 12 }, { day: "Tue", count: 18 }, { day: "Wed", count: 15 },
    { day: "Thu", count: 22 }, { day: "Fri", count: 19 }, { day: "Sat", count: 8 }, { day: "Sun", count: 4 },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5100 }, { month: "Mar", revenue: 4800 },
    { month: "Apr", revenue: 6300 }, { month: "May", revenue: 7200 },
  ],
  platformGrowth: [
    { month: "Jan", patients: 1200, doctors: 45 },
    { month: "Feb", patients: 1850, doctors: 62 },
    { month: "Mar", patients: 2400, doctors: 78 },
    { month: "Apr", patients: 3100, doctors: 95 },
    { month: "May", patients: 4280, doctors: 124 },
  ],
};

export const reviews = [
  { id: "r1", patient: "Marcus L.", rating: 5, text: "Dr. Carter took the time to truly listen. Felt heard and well cared for.", date: "3 days ago" },
  { id: "r2", patient: "Helena O.", rating: 5, text: "Outstanding cardiologist — clear explanations and a calming presence.", date: "1 week ago" },
  { id: "r3", patient: "Yuki T.", rating: 4, text: "Very professional. Slight wait but worth it.", date: "2 weeks ago" },
];

export const aiSuggestions = [
  "What are common causes of persistent headaches?",
  "How can I improve my sleep quality?",
  "What does my blood pressure reading mean?",
  "Tips for managing seasonal allergies",
];
