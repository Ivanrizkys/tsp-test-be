ALTER TABLE "work_orders" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "work_orders" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "work_order_status_history" ADD COLUMN "execute_time_seconds" integer;