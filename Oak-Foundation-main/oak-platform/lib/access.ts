import type { Role } from "@/app/components/register/types";

export const PAGE_ACCESS: Record<string, Role[]> = {
  "/qr": ["partner"],
  "/programme": ["oak_staff", "coordination_team", "presenter", "observer", "partner"],
  "/partners": ["oak_staff", "coordination_team", "presenter", "observer", "partner"],
  "/attendance": ["oak_staff", "coordination_team", "partner"],
};

export const ROLE_HOME: Record<Role, string> = {
  admin: "/attendance",
  partner: "/qr",
  oak_staff: "/programme",
  coordination_team: "/attendance",
  presenter: "/programme",
  observer: "/programme",
};

export function roleAllowedForPage(role: Role, pathname: string): boolean {
  if (role === "admin") return true;
  const allowed = PAGE_ACCESS[pathname];
  if (!allowed) return true; // pages without an explicit rule are public
  return allowed.includes(role);
}
