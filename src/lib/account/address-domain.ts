import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["Home", "Office", "Other"]),
  recipientName: z.string().min(2),
  phone: z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/),
  division: z.string().min(2),
  district: z.string().min(2),
  area: z.string().min(2),
  postalCode: z.string().min(3),
  streetAddress: z.string().min(4),
  apartment: z.string().optional().default(""),
  floor: z.string().optional().default(""),
  landmark: z.string().optional().default(""),
  deliveryInstructions: z.string().optional().default(""),
  isDefault: z.boolean().default(false),
});
export type LocalAddress = z.infer<typeof addressSchema>;
export function upsertAddress(addresses: LocalAddress[], value: LocalAddress) { const parsed = addressSchema.parse(value); const id = parsed.id || `addr-${Date.now()}`; const next = addresses.some((a) => a.id === id) ? addresses.map((a) => a.id === id ? { ...parsed, id } : a) : [{ ...parsed, id }, ...addresses]; return parsed.isDefault ? next.map((a) => ({ ...a, isDefault: a.id === id })) : next; }
export function removeAddress(addresses: LocalAddress[], id: string) { return addresses.filter((a) => a.id !== id); }
export function setDefaultAddress(addresses: LocalAddress[], id: string) { return addresses.map((a) => ({ ...a, isDefault: a.id === id })); }
