-- Create user_roles table
CREATE TABLE "user_roles" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "permissions" JSONB NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create users table
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("role_id") REFERENCES "user_roles" ("id") ON DELETE CASCADE
);

-- Create work_order_status table
CREATE TABLE "work_order_status" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create work_orders table
CREATE TABLE "work_orders" (
  "id" SERIAL PRIMARY KEY,
  "order_number" VARCHAR(255) NOT NULL UNIQUE,
  "product_name" VARCHAR(255) NOT NULL,
  "expected_quantity" INTEGER NOT NULL,
  "operator_id" INTEGER NOT NULL,
  "current_status_id" INTEGER NOT NULL,
  "due_date" TIMESTAMP NOT NULL,
  "actual_completion_date" TIMESTAMP,
  "actual_quantity" INTEGER,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("operator_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("current_status_id") REFERENCES "work_order_status" ("id") ON DELETE CASCADE
);

-- Create work_order_status_history table
CREATE TABLE "work_order_status_history" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  "work_order_id" INTEGER NOT NULL,
  "status_id" INTEGER NOT NULL,
  "note" TEXT,
  "quantity_produced" INTEGER,
  "execute_time_seconds" INTEGER,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "created_by" INTEGER NOT NULL,
  FOREIGN KEY ("work_order_id") REFERENCES "work_orders" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("status_id") REFERENCES "work_order_status" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- Create work_order_in_progress_history table
CREATE TABLE "work_order_in_progress_history" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  "progress_name" VARCHAR(255) NOT NULL,
  "work_order_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "created_by" INTEGER NOT NULL,
  FOREIGN KEY ("work_order_id") REFERENCES "work_orders" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- Add trigger functions for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for each table with updated_at column
CREATE TRIGGER update_user_roles_timestamp
BEFORE UPDATE ON "user_roles"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON "users"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_work_order_status_timestamp
BEFORE UPDATE ON "work_order_status"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_work_orders_timestamp
BEFORE UPDATE ON "work_orders"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();