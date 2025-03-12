import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  shadow: true,
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() firstName: string;

  /**
   * The last name
   */
  @Prop() lastName: string;

  /**
   * The discount price
   */
  @Prop() discountPrice: number;

  /**
   * The original price
   */
  @Prop() originalPrice: number;

  /**
   * The product ID
   */
  @Prop() productId: string;

  private getText(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  render() {
    return (
      <div>
        <p>Hello, {this.getText()}</p>
        <p>Product ID: {this.productId}</p>
        <p>Original Price: ${this.originalPrice}</p>
        <p>Discount Price: ${this.discountPrice}</p>
      </div>
    );
  }
}
