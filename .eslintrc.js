module.exports = {
  extends: ['next/core-web-vitals', 'plugin:import/recommended', 'prettier'],
  rules: {
    'jsx-a11y/alt-text': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    '@next/next/no-img-element': 'off',
    '@next/next/no-page-custom-font': 'off',
    'lines-around-comment': 0,

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], ['object', 'unknown']],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          },
          {
            pattern: 'next/**',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '~/**',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@/**',
            group: 'internal'
          }
        ],
        pathGroupsExcludedImportTypes: ['react', 'type'],
        'newlines-between': 'always-and-inside-groups'
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/parsers': {},
    'import/resolver': {
      typescript: {
        project: './jsconfig.json'
      }
    }
  },
  overrides: []
}
