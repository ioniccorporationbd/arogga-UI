export type PaymentRequest = { amount: number; method: string; orderId: string };
export type PaymentResult = { ok: boolean; provider: string; transactionId: string; simulated: boolean; message: string };
export interface PaymentProvider { charge(request: PaymentRequest): Promise<PaymentResult>; }
export class NotConfiguredPaymentProvider implements PaymentProvider { constructor(private provider: string) {} async charge(): Promise<PaymentResult> { throw new Error(`${this.provider} is not configured. Add credentials before enabling remote payments.`); } }
export class CashOnDeliveryProvider extends NotConfiguredPaymentProvider { constructor(){super("CashOnDeliveryProvider");} }
export class BkashProvider extends NotConfiguredPaymentProvider { constructor(){super("BkashProvider");} }
export class NagadProvider extends NotConfiguredPaymentProvider { constructor(){super("NagadProvider");} }
export class SSLCommerzProvider extends NotConfiguredPaymentProvider { constructor(){super("SSLCommerzProvider");} }
export class StripeProvider extends NotConfiguredPaymentProvider { constructor(){super("StripeProvider");} }
export class PayPalProvider extends NotConfiguredPaymentProvider { constructor(){super("PayPalProvider");} }
