# Stencil Kebab-Case Typings Issue

This repository demonstrates an issue with Stencil's generated typings for web components. The generated `components.d.ts` file does not include kebab-case alternatives for component properties, which causes TypeScript errors when using the web components in React or other frameworks that use kebab-case attribute names in JSX.

## The Issue

When Stencil generates the `components.d.ts` file, it only includes camelCase property names in the component interfaces. However, web components can be used with both camelCase and kebab-case attribute names in HTML and JSX. This causes TypeScript errors when using kebab-case attribute names in React or other frameworks.

For example, if a component has a property `discountPrice`, it can be used in HTML as either `discount-price` or `discountPrice`. However, the generated typings only include `discountPrice`, causing TypeScript errors when using `discount-price`.

## Reproduction Steps

1. Clone this repository
2. Run `npm install`
3. Run `npm run build` to generate the `components.d.ts` file
4. Examine the generated `dist/types/components.d.ts` file

You'll notice that the generated typings only include camelCase property names:

```typescript
export namespace Components {
    interface MyComponent {
        "discountPrice": number;
        "firstName": string;
        "lastName": string;
        "originalPrice": number;
        "productId": string;
    }
}
```

And the HTML element interface extends this interface:

```typescript
interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {
}
```

However, when using the component in HTML or JSX, both camelCase and kebab-case attribute names work:

```html
<!-- Both of these work at runtime -->
<my-component first-name="Jane" discount-price="150"></my-component>
<my-component firstName="John" discountPrice="75"></my-component>
```

But TypeScript will only recognize the camelCase attribute names:

```tsx
// This works fine with TypeScript
<my-component firstName="John" discountPrice={75} />

// This causes TypeScript errors
<my-component first-name="Jane" discount-price={150} />
```

## Expected Behavior

The Stencil compiler should automatically generate HTML element interfaces that support both camelCase and kebab-case property names:

```typescript
interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {
    // Add support for kebab-case attributes
    "discount-price"?: number;
    "first-name"?: string;
    "last-name"?: string;
    "original-price"?: number;
    "product-id"?: string;
    // existing camelCase properties from Components.MyComponent
}
```

## Workaround

A common workaround is to create a custom script that generates proper typings for React and Stencil JSX. This script:

1. Extracts all component properties from the generated `components.d.ts`
2. Converts camelCase properties to kebab-case
3. Generates React and Stencil JSX module declarations with both camelCase and kebab-case properties
4. Appends these declarations to the `components.d.ts` file

This workaround is maintenance-intensive and should be unnecessary if Stencil properly supported kebab-case attributes in its generated typings. 