import type { z } from "zod";
export async function validateRequest<T extends z.ZodTypeAny>(request: Request, schema: T): Promise<z.infer<T>> { const body = await request.json().catch(() => ({})); return schema.parse(body); }
