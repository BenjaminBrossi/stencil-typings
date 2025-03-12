import React from 'react';
import ReactDOM from 'react-dom';

// This would work fine with TypeScript
const ValidComponent = () => {
  return (
    <my-component
      firstName="John"
      lastName="Doe"
      productId="123"
      originalPrice={100}
      discountPrice={75}
    />
  );
};

// This would cause TypeScript errors because kebab-case attributes are not in the typings
const InvalidComponent = () => {
  return (
    <my-component
      first-name="Jane"
      last-name="Smith"
      product-id="456"
      original-price={200}
      discount-price={150}
    />
  );
};

ReactDOM.render(<ValidComponent />, document.getElementById('valid'));
ReactDOM.render(<InvalidComponent />, document.getElementById('invalid'));
