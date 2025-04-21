import { Component, createSignal, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "../../data/products";
import { Product } from "../../types";

const FeaturedProducts: Component = () => {
  const [products, setProducts] = createSignal<Product[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const featuredProducts = getFeaturedProducts();
      setProducts(featuredProducts);
    } catch (err) {
      setError("Failed to load featured products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  // Skeleton loader component that matches the product grid layout
  const SkeletonLoader = () => (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array(4)
        .fill(0)
        .map(() => (
          <div class="group">
            <div class="relative mb-4 overflow-hidden bg-gray-200 h-96"></div>
            <div class="text-center">
              <div class="h-5 bg-gray-200 rounded mb-1 mx-auto w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div class="text-center py-12">
      <p class="text-gray-600 mb-4">
        No featured products available at the moment.
      </p>
      <A
        href="/products"
        class="inline-block bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800"
      >
        View All Products
      </A>
    </div>
  );

  return (
    <>
      <Show when={loading()}>
        <SkeletonLoader />
      </Show>

      <Show when={error()}>
        <div class="text-center text-red-500 p-4">{error()}</div>
      </Show>

      <Show when={!loading() && !error() && products().length > 0}>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products().map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      </Show>

      <Show when={!loading() && !error() && products().length === 0}>
        <EmptyState />
      </Show>
    </>
  );
};

export default FeaturedProducts;
