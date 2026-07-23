import type { User } from "@/types";
import type { AuthRepository, OtpRequest, OtpVerifyRequest } from "../interfaces/AuthRepository";
import { NotConfiguredError } from "./NotConfiguredError";
const reject = <T>(name: string): Promise<T> => Promise.reject(new NotConfiguredError(name));
export class RemoteAuthRepository implements AuthRepository {
  getSession(): Promise<User | null> { return reject("RemoteAuthRepository.getSession"); }
  requestOtp(_input: OtpRequest): Promise<{ ok: true; phone: string; expiresInSeconds: number; demoOtp?: string }> { return reject("RemoteAuthRepository.requestOtp"); }
  verifyOtp(_input: OtpVerifyRequest): Promise<User> { return reject("RemoteAuthRepository.verifyOtp"); }
  logout(): Promise<void> { return reject("RemoteAuthRepository.logout"); }
}
