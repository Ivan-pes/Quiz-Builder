import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Not `env()`: it throws when the variable is missing, which would break
    // `npm install` (postinstall runs `prisma generate`) before .env exists
    url: process.env.DATABASE_URL,
  },
});
