export type Role =
  | "admin"
  | "partner"
  | "oak_staff"
  | "coordination_team"
  | "presenter"
  | "observer";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  partner: "Partner",
  oak_staff: "OAK Staff",
  coordination_team: "Coordination Team",
  presenter: "Presenter",
  observer: "Observer",
};

export type RegistrationData = {
  firstName: string;
  lastName: string;
  organisation: string;
  subPartner: string;
  role: string;
  email: string;
  phone: string;
  dietary: string;
  accessibility: string;
  travel: string;
};

export type RegistrationErrors = Partial<
  Record<keyof RegistrationData | "consent", string>
>;

export type RegistrationRecord = {
  reference: string;
  data: RegistrationData;
};

export type RegisterResult = {
  ok: boolean;
  error?: string;
  reference?: string;
  home?: string;
  attendee?: {
    id: string;
    reference: string;
    role: Role;
    firstName: string;
    lastName: string;
    organisation: string;
    email: string;
  };
};

export type SessionAttendee = {
  id: string;
  reference: string;
  role: Role;
  firstName: string;
  lastName: string;
  organisation: string;
  email: string;
  accessToken: string;
};

export type Attendee = {
  id: string;
  reference: string;
  first_name: string;
  last_name: string;
  organisation: string;
  sub_partner: string | null;
  role: Role;
  email: string;
  phone: string | null;
  dietary: string | null;
  accessibility: string | null;
  travel: string | null;
  accommodation: string | null;
  access_token: string | null;
  registered_at: string;
};

export type CheckinRow = {
  id: string;
  attendee_id: string;
  checked_in_at: string;
  method: string;
};

export type ProgrammeSession = {
  id: string;
  day_number: number;
  day_label: string;
  starts_at: string;
  ends_at: string | null;
  title: string;
  description: string | null;
  location: string | null;
  speaker: string | null;
  sort_order: number;
};

export type DailyPost = {
  id: string;
  day_number: number;
  day_label: string;
  title: string;
  body: string | null;
  photo_urls: string[] | null;
  published_at: string;
};

export type SessionCategory = "plenary" | "breakout" | "workshop" | "social";

export type ScheduleSession = {
  type: "session";
  startTime: string;
  endTime: string;
  title: string;
  speaker: string;
  org: string;
  venue: string;
  category: SessionCategory;
  featured?: boolean;
  description?: string;
};

export type ScheduleBreak = {
  type: "break";
  time: string;
  label: string;
};

export type ScheduleEntry = ScheduleSession | ScheduleBreak;

export const CATEGORY_COLORS: Record<SessionCategory, string> = {
  plenary: "#2B5BBD",
  breakout: "#C08A1A",
  workshop: "#7C5BB4",
  social: "#E07B1F",
};

export const CATEGORY_LABELS: Record<SessionCategory, string> = {
  plenary: "Plenary",
  breakout: "Breakout",
  workshop: "Workshop",
  social: "Social",
};

export const CATEGORY_ORDER: SessionCategory[] = [
  "plenary",
  "breakout",
  "workshop",
  "social",
];

export type Partner = {
  id: string;
  name: string;
  short_name: string | null;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  areas_of_work: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  sort_order: number;
};

export type SessionNote = {
  attendeeId: string;
  sessionId: string;
  body: string;
  updatedAt: string;
};

export type RoleHome = {
  role: Role;
  href: string;
  label: string;
};
