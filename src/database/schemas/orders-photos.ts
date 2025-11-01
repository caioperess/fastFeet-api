import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const ordersPhotos = pgTable('orders_photos', {
	id: uuid().primaryKey(),
	url: varchar({ length: 255 }).notNull(),
	uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});
