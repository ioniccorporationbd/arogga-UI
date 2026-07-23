export interface WebhookVerifier { verify(payload: string, signature: string): Promise<boolean>; }
export class NotConfiguredWebhookVerifier implements WebhookVerifier { async verify(): Promise<boolean> { throw new Error("Webhook verifier is not configured without provider credentials."); } }
