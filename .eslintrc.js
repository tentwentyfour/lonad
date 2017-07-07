// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root:    true,
  extends: 'airbnb-base',
  env:     { node: true },

  rules: {
    'no-new':                            'off',
    'max-len':                           'off',
    'no-console':                        'off',
    'key-spacing':                       'off',
    'prefer-const':                      'off',
    'comma-dangle':                      'off',
    'arrow-parens':                      'off',
    'global-require':                    'off',
    'no-multi-spaces':                   'off',
    'arrow-body-style':                  'off',
    'no-param-reassign':                 'off',
    'consistent-return':                 'off',
    'prefer-rest-params':                'off',
    'class-methods-use-this':            'off',
    'import/no-dynamic-require':         'off',
    'no-unused-vars':                    ["error", { "args": "none" }],
    'no-underscore-dangle':              ['error', { allow: ['__', '_id'] }],
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    'indent':                            ['error', 2, { "MemberExpression": 0 }],
    'no-debugger':                       process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
};
