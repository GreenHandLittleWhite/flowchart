module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', '@vue/airbnb'],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: ['warn', 4],
        'comma-dangle': ['warn', 'never'],
        'max-len': ['warn', 140],
        'func-names': 'off',
        'arrow-parens': ['error', 'as-needed'],
        'no-param-reassign': ['warn', { props: false }],
        'consistent-return': 'off'
    }
};
