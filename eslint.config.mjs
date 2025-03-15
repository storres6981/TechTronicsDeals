import eslint from '@eslint/eslintrc';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: ['next/core-web-vitals'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
