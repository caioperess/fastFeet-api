import { index, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { users } from './users';

export const orderEventStatusEnum = pgEnum('status', ['CREATED', 'AVAILABLE', 'WITHDRAWN', 'DELIVERED', 'RETURNED']);

export const ordersEvents = pgTable(
	'orders_events',
	{
		id: uuid().primaryKey(),
		orderId: uuid('order_id')
			.notNull()
			.references(() => orders.id),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		status: orderEventStatusEnum().notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(t) => [index('idx_orders_events_order_id').on(t.orderId), index('idx_orders_events_user_id').on(t.userId)],
);
