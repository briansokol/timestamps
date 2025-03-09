/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const base = {
    plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
    tailwindStylesheet: './src/app/globals.css',
    tabWidth: 4,
    printWidth: 120,
    trailingComma: 'es5',
    singleQuote: true,
    quoteProps: 'consistent',
    overrides: [
        {
            files: '*.{json,css,scss}',
            options: {
                tabWidth: 2,
            },
        },
    ],
    importOrder: ['<THIRD_PARTY_MODULES>', '<TYPE>^@/(.*)$', '^@/(.*)$', '<TYPE>^[./]', '^[./]'],
    importOrderSeparation: false,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true,
};

export default base;
