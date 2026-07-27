// ============================================
// GRUPO SAN LUIS - ESLint Configuration
// ============================================

export default [
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '*.min.js'
        ]
    },
    {
        files: ['**/*.js', '**/*.html'],
        rules: {
            // Possible Problems
            'no-cond-assign': 'error',
            'no-constant-condition': 'error',
            'no-dupe-args': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-empty': 'warn',
            'no-ex-assign': 'error',
            'no-extra-boolean-cast': 'warn',
            'no-func-assign': 'error',
            'no-inner-declarations': 'error',
            'no-irregular-whitespace': 'error',
            'no-prototype-builtins': 'warn',
            'no-unexpected-multiline': 'error',
            'no-unreachable': 'error',
            'no-unsafe-finally': 'error',
            'no-unsafe-negation': 'error',
            'use-isnan': 'error',
            'valid-typeof': 'error',

            // Best Practices
            'curly': ['warn', 'multi-line'],
            'dot-location': ['warn', 'property'],
            'eqeqeq': ['warn', 'always'],
            'no-caller': 'error',
            'no-eval': 'error',
            'no-fallthrough': 'error',
            'no-global-assign': 'error',
            'no-implicit-globals': 'warn',
            'no-implied-eval': 'error',
            'no-lone-blocks': 'warn',
            'no-loop-func': 'warn',
            'no-multi-str': 'warn',
            'no-new-wrappers': 'error',
            'no-octal': 'error',
            'no-octal-escape': 'error',
            'no-redeclare': 'error',
            'no-return-assign': 'warn',
            'no-self-assign': 'error',
            'no-self-compare': 'warn',
            'no-sequences': 'warn',
            'no-throw-literal': 'error',
            'no-unused-expressions': 'warn',
            'no-useless-call': 'warn',
            'no-useless-concat': 'warn',
            'no-useless-escape': 'warn',
            'no-with': 'error',
            'wrap-iife': ['warn', 'any'],
            'yoda': 'warn',

            // Variables
            'no-delete-var': 'error',
            'no-shadow-restricted-names': 'error',
            'no-undef': 'error',
            'no-unused-vars': ['warn', { 'args': 'none', 'caughtErrors': 'none' }],

            // Stylistic
            'array-bracket-spacing': ['warn', 'never'],
            'block-spacing': ['warn', 'always'],
            'brace-style': ['warn', '1tbs', { 'allowSingleLine': true }],
            'camelcase': 'warn',
            'comma-dangle': ['warn', 'never'],
            'comma-spacing': ['warn', { 'before': false, 'after': true }],
            'comma-style': ['warn', 'last'],
            'eol-last': ['warn', 'always'],
            'indent': ['warn', 4, { 'SwitchCase': 1 }],
            'key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }],
            'keyword-spacing': ['warn', { 'before': true, 'after': true }],
            'linebreak-style': ['warn', 'unix'],
            'new-cap': 'warn',
            'new-parens': 'warn',
            'no-mixed-spaces-and-tabs': 'error',
            'no-multi-spaces': 'warn',
            'no-trailing-spaces': 'warn',
            'no-whitespace-before-property': 'warn',
            'object-curly-spacing': ['warn', 'always'],
            'quotes': ['warn', 'single', { 'avoidEscape': true }],
            'semi': ['warn', 'always'],
            'semi-spacing': ['warn', { 'before': false, 'after': true }],
            'space-before-blocks': ['warn', 'always'],
            'space-before-function-paren': ['warn', { 'anonymous': 'always', 'named': 'never' }],
            'space-in-parens': ['warn', 'never'],
            'space-infix-ops': 'warn',
            'space-unary-ops': ['warn', { 'words': true, 'nonwords': false }],
            'spaced-comment': ['warn', 'always'],
            'switch-colon-spacing': 'warn',

            // ES6
            'arrow-parens': ['warn', 'as-needed'],
            'arrow-spacing': ['warn', { 'before': true, 'after': true }],
            'no-confusing-arrow': 'warn',
            'no-duplicate-imports': 'warn',
            'no-var': 'warn',
            'prefer-const': 'warn',
            'prefer-template': 'warn',
            'rest-spread-spacing': ['warn', 'never'],
            'template-curly-spacing': 'warn'
        }
    }
];

