import { defineConfig, env } from "prisma/config";
import "dotenv/config"; // ★ 이 줄 추가


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
