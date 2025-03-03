CREATE TABLE "work_order_in_progress_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"progress_name" varchar(255) NOT NULL,
	"work_order_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	CONSTRAINT "work_order_in_progress_history_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "work_order_status_history" ALTER COLUMN "work_order_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "work_order_status_history" ALTER COLUMN "status_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "work_order_status_history" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "work_orders" ALTER COLUMN "operator_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "work_orders" ALTER COLUMN "current_status_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "work_order_in_progress_history" ADD CONSTRAINT "work_order_in_progress_history_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_order_in_progress_history" ADD CONSTRAINT "work_order_in_progress_history_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;