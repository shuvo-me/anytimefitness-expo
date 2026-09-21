import { type Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
    ssl: 'require',
  },
  schemaFilter: ['public'],
  strict: true,
  verbose: true,
} satisfies Config;
