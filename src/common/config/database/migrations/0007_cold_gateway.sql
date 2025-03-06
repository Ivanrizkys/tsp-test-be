ALTER TABLE "user_roles" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-06 10:39:30.341';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-06 10:39:30.342';--> statement-breakpoint
ALTER TABLE "work_order_status" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-06 10:39:30.342';--> statement-breakpoint
ALTER TABLE "work_orders" ALTER COLUMN "updated_at" SET DEFAULT '2025-03-06 10:39:30.343';--> statement-breakpoint
ALTER TABLE "work_orders" ADD COLUMN "actual_quantity" integer;