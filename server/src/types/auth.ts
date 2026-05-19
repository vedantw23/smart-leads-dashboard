export type UserRole = "admin" | "sales";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
