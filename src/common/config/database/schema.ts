/* eslint-disable perfectionist/sort-objects */
import { integer, jsonb, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const utcPlus7 = () => {
  const date = new Date();
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

export const userRolesTable = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  permissions: jsonb("permissions").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(utcPlus7())
    .$onUpdate(() => utcPlus7()),
});

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().unique().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  roleId: integer("role_id")
    .references(() => userRolesTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(utcPlus7())
    .$onUpdate(() => utcPlus7()),
});

export const workOrderStatusTable = pgTable("work_order_status", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().unique().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(utcPlus7())
    .$onUpdate(() => utcPlus7()),
});

export const workOrderTable = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 255 }).notNull().unique(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  expectedQuantity: integer("expected_quantity").notNull(),
  operatorId: integer("operator_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  currentStatusId: integer("current_status_id")
    .references(() => workOrderStatusTable.id, { onDelete: "cascade" })
    .notNull(),
  dueDate: timestamp("due_date").notNull(),
  actualCompletionDate: timestamp("actual_completion_date"),
  actualQuantity: integer("actual_quantity"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(utcPlus7())
    .$onUpdate(() => utcPlus7()),
});

export const workOrderStatusHistoryTable = pgTable("work_order_status_history", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().unique().defaultRandom(),
  workOrderId: integer("work_order_id")
    .references(() => workOrderTable.id, { onDelete: "cascade" })
    .notNull(),
  statusId: integer("status_id")
    .references(() => workOrderStatusTable.id, { onDelete: "cascade" })
    .notNull(),
  note: text("note"),
  quantityProduced: integer("quantity_produced"),
  executeTimeSeconds: integer("execute_time_seconds"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const workOrderInProgressHistoryTable = pgTable("work_order_in_progress_history", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().unique().defaultRandom(),
  progressName: varchar("progress_name", { length: 255 }).notNull(),
  workOrderId: integer("work_order_id")
    .references(() => workOrderTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
});

export type InsertUserRoles = typeof userRolesTable.$inferInsert;
export type InsertUsers = typeof usersTable.$inferInsert;
export type InsertWorkOrder = typeof workOrderTable.$inferInsert;
export type InsertWorkOrderInProgressHistory = typeof workOrderInProgressHistoryTable.$inferInsert;
export type InsertWorkOrderStatus = typeof workOrderStatusTable.$inferInsert;
export type InsertWorkOrderStatusHistory = typeof workOrderStatusHistoryTable.$inferInsert;

export type UserRoles = typeof userRolesTable.$inferSelect;
export type Users = typeof usersTable.$inferSelect;
export type WorkOrder = typeof workOrderTable.$inferSelect;
export type WorkOrderInProgressHistory = typeof workOrderInProgressHistoryTable.$inferSelect;
export type WorkOrderStatus = typeof workOrderStatusTable.$inferSelect;
export type WorkOrderStatusHistory = typeof workOrderStatusHistoryTable.$inferSelect;
