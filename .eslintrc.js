module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'eol-last': 0,
    'space-before-function-paren': 0,
    'semi': [0],
    'no-constant-condition': 0,
    'no-unused-vars': 0,
    'quotes': 0,
    'indent': 0,
    'no-tabs': 0,
    'no-undef': 0,
    'no-mixed-spaces-and-tabs': 0,
    'no-trailing-spaces': 0,
    'spaced-comment': 0,
    'comma-spacing': 0,
    'no-duplicate-imports': 0,
    'comma-dangle': 0,
    'no-unneeded-ternary': 0,
    'eqeqeq': 0,
    'Trailing spaces not allowed': 0,
    'space-infix-ops': 0,
    'keyword-spacing': 0,
    'key-spacing': 0,
    'space-before-blocks': 0,
    'semi-spacing': 0,
    'quotes': 0,
    'arrow-spacing': 0,
    'one-var': 0,
    'no-useless-escape': 0,
    'space-in-parens': 0,
    'block-spacing': 0,
    'brace-style': 0,
    'padded-blocks': 0,
    'object-curly-spacing':0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
