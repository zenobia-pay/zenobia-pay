import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: Component<ProductCardProps> = (props) => {
  return (
    <div class="group">
      <div class="relative mb-4 overflow-hidden">
        <A href={`/products/${props.product.id}`}>
          <img
            src={props.product.image}
            alt={props.product.name}
            class="w-full h-96 object-cover object-center transform group-hover:scale-105 transition duration-500"
          />
        </A>
        <button
          class="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 py-2 text-center text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition duration-300"
          onClick={() => console.log(`Add to cart: ${props.product.id}`)}
        >
          Add to Cart
        </button>
      </div>
      <div class="text-center">
        <A
          href={`/products/${props.product.id}`}
          class="block mb-1 text-gray-900 hover:underline"
        >
          {props.product.name}
        </A>
        <span class="text-gray-600">${props.product.price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ProductCard;
