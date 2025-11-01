import { index, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { ordersPhotos } from './orders-photos';
import { recipients } from './recipients';
import { users } from './users';

export const orderStatusEnum = pgEnum('status', ['PENDING', 'AVAILABLE', 'WITHDRAWN', 'DELIVERED', 'RETURNED']);

export const orders = pgTable(
	'orders',
	{
		id: uuid().primaryKey(),
		recipientId: uuid('recipient_id')
			.notNull()
			.references(() => recipients.id),
		deliverymanId: uuid('deliveryman_id')
			.notNull()
			.references(() => users.id),
		deliveryPhotoId: uuid('delivery_photo_id').references(() => ordersPhotos.id),
		status: orderStatusEnum().notNull().default('PENDING'),
		withdrawAt: timestamp('withdraw_at'),
		deliveredAt: timestamp('delivered_at'),
		returnedAt: timestamp('returned_at'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(t) => [
		index('idx_orders_recipient_id').on(t.recipientId),
		index('idx_orders_deliveryman_id').on(t.deliverymanId),
		index('idx_orders_status').on(t.status),
	],
);
