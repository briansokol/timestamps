Add JSDoc comments above class and function defintions.

Add comments to complex code to improve clarity.

Use public and private modifiers on class methods and properties.

Private class methods and properties should begin with an underscore.

Always add TypeScript types for function inputs and return values.

When installing with npm, add --save-exact to commands.

Use Vitest for unit tests. Do not use Jest.

Vitest functions are not globals. They need to be imported.

Wrap tests with describe() and it(), and not test().

React component tests should use React Testing Library.

Instead of using the destructured return from Testing Library's render() function, use the screen object instead.

Try to avoide direct DOM node access in tests, and use Testing Library functions only.
