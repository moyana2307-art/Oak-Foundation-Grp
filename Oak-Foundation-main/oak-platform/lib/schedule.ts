import type { ScheduleEntry } from "@/app/components/register/types";

export const SCHEDULE_DAYS = [
  { day: 1, short: "MON", date: "9 Mar" },
  { day: 2, short: "TUE", date: "10 Mar" },
  { day: 3, short: "WED", date: "11 Mar" },
] as const;

export const SEED_SCHEDULE: Record<number, ScheduleEntry[]> = {
  1: [
    { type: "break", time: "08:30", label: "Registration & Coffee" },
    {
      type: "session",
      startTime: "09:30",
      endTime: "10:50",
      title: "Opening Plenary: Partner Convening 2026",
      speaker: "Maria Schmidt",
      org: "Open Society Foundations",
      venue: "Main Hall A",
      category: "plenary",
      featured: true,
      description:
        "Welcome address to the 2026 partner convening, with the CEO framing the theme of shared learning infrastructure and what the three days in Harare aim to deliver.",
    },
    { type: "break", time: "10:50", label: "Coffee Break" },
    {
      type: "session",
      startTime: "11:15",
      endTime: "12:45",
      title: "Workshop: Advocacy Effectiveness Lab",
      speaker: "Samuel Okafor",
      org: "Africa Climate Alliance",
      venue: "Room 3",
      category: "workshop",
      description:
        "Hands-on working session on measuring advocacy impact, using the portfolio live-poll data shared in the opening plenary.",
    },
    { type: "break", time: "13:00", label: "Networking Lunch" },
    {
      type: "session",
      startTime: "14:00",
      endTime: "15:15",
      title: "Breakout: Climate & Civic Space",
      speaker: "Fatima Benali",
      org: "MENA Rights Group",
      venue: "Plenary Hall",
      category: "breakout",
      description:
        "Small-group exchange on protecting civic space while scaling climate finance, with regional case studies.",
    },
    { type: "break", time: "15:30", label: "Afternoon Tea" },
    {
      type: "session",
      startTime: "16:00",
      endTime: "17:00",
      title: "Breakout: Digital Rights Integration",
      speaker: "Naledi Mokoena",
      org: "Digital Frontiers Institute",
      venue: "Room 4",
      category: "breakout",
      description:
        "Breakout on embedding digital rights across programme areas rather than holding them in a separate line item.",
    },
    {
      type: "session",
      startTime: "18:00",
      endTime: "20:00",
      title: "Welcome Reception",
      speaker: "Tanya Marufu",
      org: "OAK Foundation",
      venue: "Terrace",
      category: "social",
      description:
        "Informal evening reception to welcome partners, hosted in the venue terrace garden with the coordination team.",
    },
  ],
  2: [
    { type: "break", time: "08:30", label: "Registration & Coffee" },
    {
      type: "session",
      startTime: "09:00",
      endTime: "10:30",
      title: "Keynote: Shared Learning Infrastructure",
      speaker: "Ingrid Holm",
      org: "Nordic Evaluation Centre",
      venue: "Main Hall A",
      category: "plenary",
      featured: true,
      description:
        "Keynote on why philanthropy must accept 10+ year time horizons, with the shared learning infrastructure proposal as the flagship ask.",
    },
    { type: "break", time: "10:30", label: "Coffee Break" },
    {
      type: "session",
      startTime: "11:00",
      endTime: "12:30",
      title: "Workshop: Consortium Designs",
      speaker: "Tanya Marufu",
      org: "OAK Foundation",
      venue: "Room 2",
      category: "workshop",
      description:
        "Design session for multi-partner consortia proposals under the new shared infrastructure fund.",
    },
    { type: "break", time: "13:00", label: "Networking Lunch" },
    {
      type: "session",
      startTime: "14:00",
      endTime: "15:30",
      title: "Featured Panel: Climate & Civic Space",
      speaker: "Fatima Benali",
      org: "MENA Rights Group",
      venue: "Plenary Hall",
      category: "plenary",
      description:
        "Panel on the interplay between climate finance and civic space, with perspectives from three regions.",
    },
    { type: "break", time: "15:30", label: "Afternoon Tea" },
    {
      type: "session",
      startTime: "16:00",
      endTime: "17:15",
      title: "Breakout: Monitoring & Learning Frameworks",
      speaker: "David Ndlovu",
      org: "HEAL Trust",
      venue: "Room 4",
      category: "breakout",
      description:
        "Deep-dive on M&E frameworks that are useful to grantees rather than administrative burden.",
    },
  ],
  3: [
    { type: "break", time: "08:30", label: "Registration & Coffee" },
    {
      type: "session",
      startTime: "09:00",
      endTime: "10:30",
      title: "Plenary: Consortium Designs Review",
      speaker: "Ingrid Holm",
      org: "Nordic Evaluation Centre",
      venue: "Main Hall A",
      category: "plenary",
      featured: true,
      description:
        "Synthesis of the consortium designs produced on day two, consolidated into a shared proposal roadmap.",
    },
    { type: "break", time: "10:30", label: "Coffee Break" },
    {
      type: "session",
      startTime: "11:00",
      endTime: "12:30",
      title: "Breakout: Shared Learning Infrastructure",
      speaker: "Samuel Okafor",
      org: "Africa Climate Alliance",
      venue: "Room 3",
      category: "breakout",
      description:
        "Breakout to pressure-test the shared learning infrastructure pitch across portfolios.",
    },
    { type: "break", time: "13:00", label: "Networking Lunch" },
    {
      type: "session",
      startTime: "14:30",
      endTime: "16:00",
      title: "Closing Plenary: The Harare Pledge",
      speaker: "Maria Schmidt",
      org: "Open Society Foundations",
      venue: "Main Hall A",
      category: "plenary",
      description:
        "Closing session finalising the joint pledge and the community commitments each partner takes home.",
    },
  ],
};