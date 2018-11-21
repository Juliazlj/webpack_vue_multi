// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    "plugin:vue/base",
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'html',
    'vue'
  ],
  "globals": {
    "$": true
  },
  rules: {
    "indent": 2,
    'eqeqeq': 0,
    'no-undef': 0,
    'no-tabs': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  }
}
