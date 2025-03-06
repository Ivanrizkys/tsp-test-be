import type { ZodType } from "zod";

/**
 * Validates data against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data
 * @typeParam T - Type of the data to validate
 */
export function Validate<T>(schema: ZodType, data: T): T {
  return schema.parse(data);
}
