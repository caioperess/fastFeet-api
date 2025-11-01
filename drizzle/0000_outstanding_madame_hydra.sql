CREATE TYPE "public"."status" AS ENUM('PENDING', 'AVAILABLE', 'WITHDRAWN', 'DELIVERED', 'RETURNED');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('admin', 'deliveryman');--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipient_id" uuid NOT NULL,
	"package_id" uuid NOT NULL,
	"message" varchar(255) NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"sent_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipient_id" uuid NOT NULL,
	"deliveryman_id" uuid NOT NULL,
	"delivery_photo_id" uuid,
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"withdraw_at" timestamp,
	"delivered_at" timestamp,
	"returned_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders_photos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"url" varchar(255) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"street" varchar(255) NOT NULL,
	"number" varchar(10) NOT NULL,
	"complement" varchar(255),
	"neighborhood" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" varchar(2) NOT NULL,
	"zipcode" varchar(10) NOT NULL,
	"latitude" numeric(3, 8) NOT NULL,
	"longitude" numeric(3, 8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"cpf" varchar(11) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "roles" NOT NULL,
	CONSTRAINT "users_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_package_id_orders_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_deliveryman_id_users_id_fk" FOREIGN KEY ("deliveryman_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_photo_id_orders_photos_id_fk" FOREIGN KEY ("delivery_photo_id") REFERENCES "public"."orders_photos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_events" ADD CONSTRAINT "orders_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_events" ADD CONSTRAINT "orders_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_orders_recipient_id" ON "orders" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "idx_orders_deliveryman_id" ON "orders" USING btree ("deliveryman_id");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_events_order_id" ON "orders_events" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_orders_events_user_id" ON "orders_events" USING btree ("user_id");