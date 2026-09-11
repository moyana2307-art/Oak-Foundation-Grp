import type { Role } from "@/app/components/register/types";

export const PAGE_ACCESS: Record<string, Role[]> = {
  "/qr": ["partner"],
  "/programme": ["oak_staff", "coordination_team", "presenter", "observer"],
  "/partners": ["oak_staff", "coordination_team", "presenter", "observer"],
  "/check-in": ["coordination_team"],
  "/attendance": ["coordination_team"],
};

export const ROLE_HOME: Record<Role, string> = {
  partner: "/qr",
  oak_staff: "/programme",
  coordination_team: "/attendance",
  presenter: "/programme",
  observer: "/programme",
};

export function roleAllowedForPage(role: Role, pathname: string): boolean {
  const allowed = PAGE_ACCESS[pathname];
  if (!allowed) return true; // pages without an explicit rule are public
  return allowed.includes(role);
}
