import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolves the `@/*` alias straight from tsconfig.json.
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // Tests cover pure logic: services, adapters, route helpers and formatters.
    // Add `environment: "jsdom"` plus @testing-library/react for component tests.
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
