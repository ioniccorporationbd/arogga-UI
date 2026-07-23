import type { Address } from "@/types";

export interface AddressRepository {
  list(userId?: string): Promise<Address[]>;
  add(address: Address): Promise<Address[]>;
  update(id: string, address: Partial<Address>): Promise<Address[]>;
  remove(id: string): Promise<Address[]>;
  setDefault(id: string): Promise<Address[]>;
}
