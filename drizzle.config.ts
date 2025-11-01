import { env } from '@/env';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/database/schemas',
  casing: "snake_case",

  dbCredentials: {
    url: env.DATABASE_URL,
  },

  schemaFilter: "public",

   migrations: {
    schema: "public",
  },
});
