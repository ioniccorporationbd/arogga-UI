import type { AccountSummary, User } from "@/types";
import type { ProfileRepository } from "../interfaces/ProfileRepository";
import { NotConfiguredError } from "./NotConfiguredError";
const reject = <T>(name: string): Promise<T> => Promise.reject(new NotConfiguredError(name));
export class RemoteProfileRepository implements ProfileRepository {
  getProfile(_userId?: string): Promise<User | null> { return reject("RemoteProfileRepository.getProfile"); }
  updateProfile(_profile: Partial<User>): Promise<User> { return reject("RemoteProfileRepository.updateProfile"); }
  getAccountSummary(_userId?: string): Promise<AccountSummary> { return reject("RemoteProfileRepository.getAccountSummary"); }
}
