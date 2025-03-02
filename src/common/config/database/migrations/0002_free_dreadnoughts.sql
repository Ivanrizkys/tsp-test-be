ALTER TABLE "users" ALTER COLUMN "role_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "work_order_status" ADD CONSTRAINT "work_order_status_name_unique" UNIQUE("name");