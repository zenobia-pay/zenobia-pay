import { Component, createSignal, onMount } from "solid-js";
import { useParams, useSearchParams } from "@solidjs/router";
import ProductCard from "../components/products/ProductCard";
import { getProducts, getProductsByCategory } from "../data/products";
import { Product } from "../types";
import { Show } from "solid-js";

const ProductsPage: Component = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = createSignal<Product[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(
    searchParams.category ? String(searchParams.category) : null
  );

  const categories = ["clothing", "shoes", "accessories"];

  onMount(async () => {
    try {
      if (selectedCategory()) {
        const categoryProducts = getProductsByCategory(selectedCategory()!);
        setProducts(categoryProducts);
      } else {
        const allProducts = getProducts();
        setProducts(allProducts);
      }
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  const handleCategoryChange = async (category: string | null) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      if (category) {
        const categoryProducts = getProductsByCategory(category);
        setProducts(categoryProducts);
      } else {
        const allProducts = getProducts();
        setProducts(allProducts);
      }
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-serif mb-8">All Products</h1>

      <div class="mb-8">
        <div class="flex flex-wrap gap-2">
          <button
            class={`px-4 py-2 text-sm uppercase tracking-wider ${
              selectedCategory() === null
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => handleCategoryChange(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              class={`px-4 py-2 text-sm uppercase tracking-wider ${
                selectedCategory() === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Show when={loading()}>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array(8)
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
      </Show>

      <Show when={error()}>
        <div class="text-center text-red-500 p-4">{error()}</div>
      </Show>

      <Show when={!loading() && !error() && products().length === 0}>
        <div class="text-center py-12">
          <p class="text-gray-600">No products found in this category.</p>
        </div>
      </Show>

      <Show when={!loading() && !error() && products().length > 0}>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products().map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      </Show>
    </div>
  );
};

export default ProductsPage;
