import { boolean, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { orders } from './orders';
import { recipients } from './recipients';

export const notificationStatus = pgEnum('status', ['PENDING', 'SENT', 'FAILED']);

export const notifications = pgTable('notifications', {
	id: uuid().primaryKey(),
	recipientId: uuid('recipient_id')
		.notNull()
		.references(() => recipients.id),
	packageId: uuid('package_id')
		.notNull()
		.references(() => orders.id),
	message: varchar({ length: 255 }).notNull(),
	read: boolean().notNull().default(false),
	status: notificationStatus().notNull().default('PENDING'),
	sentAt: timestamp('sent_at'),
});
