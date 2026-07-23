import type { AccountSummary, User } from "@/types";

export interface ProfileRepository {
  getProfile(userId?: string): Promise<User | null>;
  updateProfile(profile: Partial<User>): Promise<User>;
  getAccountSummary(userId?: string): Promise<AccountSummary>;
}
