import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: Component<ProductCardProps> = (props) => {
  const { addToCart } = useCart();

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleAddToCart = () => {
    addToCart(props.product, 1);
  };

  return (
    <div class="group">
      <div class="relative mb-4 overflow-hidden">
        <A href={`/products/${props.product._id}`}>
          <img
            src={props.product.imageUrl}
            alt={props.product.name}
            class="w-full h-96 object-cover object-center transform group-hover:scale-105 transition duration-500"
          />
        </A>
        <button
          class="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 py-2 text-center text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
      <div class="text-center">
        <A
          href={`/products/${props.product._id}`}
          class="block mb-1 text-gray-900 hover:underline"
        >
          {props.product.name}
        </A>
        <span class="text-gray-600">{formatPrice(props.product.price)}</span>
        {props.product.isNew && (
          <span class="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
            New
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
