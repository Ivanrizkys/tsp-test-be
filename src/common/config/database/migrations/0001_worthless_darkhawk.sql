ALTER TABLE "users" DROP CONSTRAINT "users_role_id_user_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "work_order_status_history" DROP CONSTRAINT "work_order_status_history_work_order_id_work_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "work_order_status_history" DROP CONSTRAINT "work_order_status_history_status_id_work_order_status_id_fk";
--> statement-breakpoint
ALTER TABLE "work_order_status_history" DROP CONSTRAINT "work_order_status_history_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_operator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_current_status_id_work_order_status_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_user_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."user_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_order_status_history" ADD CONSTRAINT "work_order_status_history_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_order_status_history" ADD CONSTRAINT "work_order_status_history_status_id_work_order_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."work_order_status"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_order_status_history" ADD CONSTRAINT "work_order_status_history_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_operator_id_users_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_current_status_id_work_order_status_id_fk" FOREIGN KEY ("current_status_id") REFERENCES "public"."work_order_status"("id") ON DELETE cascade ON UPDATE no action;