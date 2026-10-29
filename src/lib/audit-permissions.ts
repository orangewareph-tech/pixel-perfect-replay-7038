export function isAuditAdmin(role: { role: string } | null | undefined) {
  return role?.role === "admin";
}