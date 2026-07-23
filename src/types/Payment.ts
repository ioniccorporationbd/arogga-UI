export type PaymentMethod = {
  id: string;
  type: "cod" | "bkash" | "nagad" | "rocket" | "sslcommerz" | "card" | "bank" | "stripe" | "paypal" | "apple_pay" | "google_pay";
  label: string;
  enabled: boolean;
};

export type DeliveryMethod = {
  id: string;
  type: "standard" | "express" | "store_pickup";
  label: string;
  fee: number;
  eta: string;
  enabled: boolean;
};
