import { type Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
    ssl: 'require',
  },
  schemaFilter: ['public'],
} satisfies Config;
