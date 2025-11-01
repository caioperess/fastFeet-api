import { decimal, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const recipients = pgTable('recipients', {
	id: uuid().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	street: varchar({ length: 255 }).notNull(),
	number: varchar({ length: 10 }).notNull(),
	complement: varchar({ length: 255 }),
	neighborhood: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 2 }).notNull(),
	zipcode: varchar({ length: 10 }).notNull(),
	latitude: decimal({ precision: 3, scale: 8 }).notNull(),
	longitude: decimal({ precision: 3, scale: 8 }).notNull(),
});
