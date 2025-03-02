import type { ZodType } from "zod";

export function Validate<T>(schema: ZodType, data: T): T {
  return schema.parse(data);
}
