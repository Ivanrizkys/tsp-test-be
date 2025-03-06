import { z } from "zod";

export const CreateWorkOrderRequestSchema = z.object({
  due_date: z.coerce.date({ message: "Due date must be a date" }).min(new Date(), { message: "Due date must be in the future" }),
  expected_quantity: z.number({ message: "Expected quantity must be a number" }).min(1, { message: "Expected quantity must be greater than 0" }),
  note: z.string({ message: "Note must be a string" }).optional(),
  operator_id: z.number({ message: "Operator ID must be a number" }).min(1, { message: "Operator ID must be greater than 0" }),
  product_name: z.string({ message: "Product name must be a string" }).min(1, { message: "Product name must be at least 1 character" }),
});

export const UpdateWorkOrderManagerRequestSchema = z.object({
  in_progress_state: z
    .string({ message: "In progress state must be a string" })
    .min(1, { message: "In progress state must be at least 1 character" })
    .optional(),
  note: z.string({ message: "Note must be a string" }).optional(),
  operator_id: z.number({ message: "Operator ID must be a number" }).min(1, { message: "Operator ID must be greater than 0" }),
  quantity_produced: z.number({ message: "Quantity produced must be a number" }).min(-1, { message: "Quantity produced not be negative" }),
  status_id: z.number({ message: "Status ID must be a number" }).min(1, { message: "Status ID must be greater than 0" }),
  work_order_id: z.number({ message: "Work order ID must be a number" }).min(1, { message: "Work order ID must be greater than 0" }),
});

export const UpdateWorkOrderOperatorRequestSchema = z.object({
  in_progress_state: z
    .string({ message: "In progress state must be a string" })
    .min(1, { message: "In progress state must be at least 1 character" })
    .optional(),
  note: z.string({ message: "Note must be a string" }).optional(),
  quantity_produced: z.number({ message: "Quantity produced must be a number" }).min(-1, { message: "Quantity produced not be negative" }),
  status_id: z.number({ message: "Status ID must be a number" }).min(1, { message: "Status ID must be greater than 0" }),
  work_order_id: z.number({ message: "Work order ID must be a number" }).min(1, { message: "Work order ID must be greater than 0" }),
});

export const GetWorkOrderDetailParamsSchema = z.object({
  work_order_id: z.number({ message: "Work order ID must be a number" }).min(1, { message: "Work order ID must be greater than 0" }),
});

export const GetWorkOrderParamsSchema = z.object({
  created_at: z.coerce.date({ message: "Created at must be a date" }).optional(),
  page: z.number({ message: "Page must be a number" }).min(1, { message: "Page must be greater than 0" }),
  per_page: z.number({ message: "Per page must be a number" }).min(1, { message: "Per page must be greater than 0" }),
  status_id: z.number({ message: "Status id must be a number" }).min(1, { message: "Status id must be greater than 0" }).optional(),
});
