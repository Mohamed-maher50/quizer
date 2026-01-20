import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import ImportSorting from "eslint-plugin-simple-import-sort";
console.log(ImportSorting);
const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  ...nextTs,
  {
    plugins: {
      "simple-import-sort": ImportSorting,
    },
  },
  // Override default ignores of eslint-config-next.
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // Optional: Next.js recommends disabling other sorting rules to avoid conflicts
      "sort-imports": "off",
      "import/order": "off",
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
