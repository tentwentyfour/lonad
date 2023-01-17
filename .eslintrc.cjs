module.exports ={
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [],
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    'indent': ['warn', 2, { MemberExpression: 1, SwitchCase: 1 }],

    'object-curly-spacing':                 ['warn', 'always'],
    'keyword-spacing':                      'warn',
    'no-console':                           'off',
    'no-continue':                          'off',
    'key-spacing':                          'off',
    'default-case':                         'off',
    'prefer-const':                         'warn',
    'comma-dangle':                         'off',
    'arrow-parens':                         'off',
    'guard-for-in':                         'off',
    'global-require':                       'off',
    'no-multi-assign':                      'off',
    'no-await-in-loop':                     'warn',
    'no-multi-spaces':                      'off',
    'arrow-body-style':                     'off',
    'no-return-assign':                     'off',
    'no-mixed-operators':                   ['error', { allowSamePrecedence: true }],
    'no-param-reassign':                    'warn',
    'consistent-return':                    'off',
    'prefer-rest-params':                   'off',
    'prefer-destructuring':                 'off',
    'object-curly-newline':                 'off',
    'no-underscore-dangle':                 ['error', { allow: ['__', '_id', '_watcher'] }],
    'no-use-before-define':                 'off',
    'no-unused-expressions':                'warn',
    'no-restricted-syntax':                 'off',
    'prefer-object-spread':                 'off',
    'max-classes-per-file':                 'off',
    'no-prototype-builtins':                'off',
    'prefer-arrow-callback':                'off',
    'array-callback-return':                'off',
    'no-multiple-empty-lines':              ['error', { max: 2, maxEOF: 0 }],
    'no-restricted-properties':             ['error', { property : 'lenght' }], // prevent annoying typo
    'lines-between-class-members':          'off',

    'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
    'no-shadow': 'off',
    'dot-notation': 'warn',
    'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
    'object-shorthand': 'warn',
    'function-paren-newline': 'warn',
    'template-curly-spacing': 'warn',
    'no-return-await': 'warn',
    'operator-linebreak': 'warn',
    'no-unneeded-ternary': 'warn',
    'no-throw-literal': 'warn',
    'no-loop-func': 'warn',
    'object-property-newline': 'off',
    'newline-per-chained-call': 'warn',
    'no-undef-init': 'warn',
    'no-fallthrough': 'warn',
    'no-async-promise-executor': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-irregular-whitespace': 'warn',
    'prefer-promise-reject-errors': 'warn',

    'import/first':                      'off',
    'import/order':                      'off',
    'import/no-named-as-default':        'off',
    'import/no-named-as-default-member': 'off',
    'import/prefer-default-export':      'off',
    'import/no-dynamic-require':         'off',
    
    'no-duplicate-imports':         'warn',

    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
