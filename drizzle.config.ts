import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: `./db/birthdayz.sqlite`,
  },
  schema: `./src/schema.ts`,
  out: `./db/migrations/`,
  dialect: "sqlite",
});
