import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('roles', ['admin', 'deliveryman']);

export const users = pgTable('users', {
	id: uuid().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	cpf: varchar({ length: 11 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	role: rolesEnum().notNull(),
});
