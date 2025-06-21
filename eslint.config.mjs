import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/display-name": "off",
      "no-console": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "react/react-in-jsx-scope": "off",
      "import/no-anonymous-default-export": "off",
      "no-empty-function": "off",
      "no-debugger": "off",
      "no-alert": "off",
      "no-restricted-globals": "off",
    },
  },
];
