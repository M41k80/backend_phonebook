import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'

const config = [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['**/node_modules/**', '**/dist/**'], // Reemplaza .eslintignore
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      'no-console': 'off', // Permitir console.log para debug
      'react/prop-types': 'off', // Desactivar validación de prop-types si no se usa
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
    },
  },
  {
    env: {
      node: true,
      es2021: true,
      commonjs: true,
    },
    files: ['.eslintrc.{js,cjs}'],
    parserOptions: {
      sourceType: 'script',
    },
  },
]

export default config
