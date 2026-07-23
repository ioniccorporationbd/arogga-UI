import type { Address } from "@/types";
import type { AddressRepository } from "../interfaces/AddressRepository";
import { NotConfiguredError } from "./NotConfiguredError";
const reject = <T>(name: string): Promise<T> => Promise.reject(new NotConfiguredError(name));
export class RemoteAddressRepository implements AddressRepository {
  list(_userId?: string): Promise<Address[]> { return reject("RemoteAddressRepository.list"); }
  add(_address: Address): Promise<Address[]> { return reject("RemoteAddressRepository.add"); }
  update(_id: string, _address: Partial<Address>): Promise<Address[]> { return reject("RemoteAddressRepository.update"); }
  remove(_id: string): Promise<Address[]> { return reject("RemoteAddressRepository.remove"); }
  setDefault(_id: string): Promise<Address[]> { return reject("RemoteAddressRepository.setDefault"); }
}
