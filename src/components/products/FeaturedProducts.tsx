import { Component, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import ProductCard from "./ProductCard";
import { getProducts } from "../../data/products";

const FeaturedProducts: Component = () => {
  const [products] = createSignal(getProducts().slice(0, 4));

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products().map((product) => (
        <ProductCard product={product} />
      ))}
    </div>
  );
};

export default FeaturedProducts;
