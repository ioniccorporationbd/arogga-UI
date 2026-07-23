export type AddressType = "home" | "office" | "other";

export type Address = {
  id: string;
  recipientName: string;
  mobile: string;
  division: string;
  district: string;
  area: string;
  postalCode?: string;
  fullAddress: string;
  landmark?: string;
  apartment?: string;
  floor?: string;
  type: AddressType;
  isDefault: boolean;
  deliveryNote?: string;
  latitude?: number;
  longitude?: number;
};
