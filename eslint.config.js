import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.codegraph/**',
      '.sites-runtime/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': hooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'localStorage',
        'sessionStorage',
        'navigator',
        'fetch',
        'Blob',
      ],
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        URL: 'readonly',
        Response: 'readonly',
      },
    },
  },
  prettier,
);
