import { Component, createSignal, createEffect, Show } from "solid-js";
import { useSearchParams, A } from "@solidjs/router";
import { getProducts, getProductsByCategory } from "../data/products";
import { Product } from "../types";

const ProductsPage: Component = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = createSignal<Product[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(
    null
  );
  const [sortBy, setSortBy] = createSignal("newest");

  const categories = [
    { id: "all", name: "All Products" },
    { id: "clothing", name: "Clothing" },
    { id: "shoes", name: "Shoes" },
    { id: "accessories", name: "Accessories" },
  ];

  createEffect(() => {
    setIsLoading(true);
    const category = searchParams.category
      ? String(searchParams.category)
      : selectedCategory();

    let filteredProducts: Product[];
    if (category && category !== "all") {
      setSelectedCategory(category);
      filteredProducts = getProductsByCategory(category);
    } else {
      setSelectedCategory(null);
      filteredProducts = getProducts();
    }

    // Sort products
    const sorted = [...filteredProducts].sort((a, b) => {
      if (sortBy() === "price-asc") {
        return a.price - b.price;
      } else if (sortBy() === "price-desc") {
        return b.price - a.price;
      } else {
        // Default: newest first (assuming newer items have higher IDs)
        return parseInt(b.id) - parseInt(a.id);
      }
    });

    setProducts(sorted);
    setIsLoading(false);
  });

  return (
    <div>
      {/* Breadcrumb navigation */}
      <div class="border-b border-gray-200 py-4">
        <div class="container mx-auto px-4">
          <div class="flex items-center text-sm">
            <A href="/" class="text-gray-600 hover:text-black">
              Men
            </A>
            <span class="mx-2">/</span>
            <span class="font-medium">
              {selectedCategory()
                ? categories.find((cat) => cat.id === selectedCategory())?.name
                : "All Products"}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and sorting controls at the top */}
      <div class="border-b border-gray-200 py-4">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap items-center justify-between">
            <div class="flex space-x-8 mb-4 md:mb-0">
              {categories.map((category) => (
                <button
                  class={`text-sm uppercase tracking-wider hover:text-black ${
                    selectedCategory() === category.id ||
                    (!selectedCategory() && category.id === "all")
                      ? "text-black font-medium"
                      : "text-gray-500"
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      category.id === "all" ? null : category.id
                    )
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div class="flex items-center">
              <span class="text-sm mr-4">Sort by:</span>
              <div class="relative">
                <select
                  class="appearance-none bg-transparent border border-gray-300 pl-4 pr-8 py-1 text-sm focus:outline-none focus:border-black"
                  value={sortBy()}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div class="py-8">
        {isLoading() ? (
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
            {products().map((product) => (
              <div class="group relative border border-gray-200 overflow-hidden">
                <A href={`/products/${product.id}`} class="block">
                  <div class="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Overlay with product details on hover */}
                  <div class="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 class="text-white text-lg font-medium mb-1">
                      {product.name}
                    </h3>
                    <p class="text-white text-sm mb-3">
                      ${product.price.toFixed(2)}
                    </p>
                    <button
                      class="bg-white text-black py-2 text-sm uppercase tracking-wider w-full mt-auto hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`Add to cart: ${product.id}`);
                      }}
                    >
                      Shop This
                    </button>
                  </div>
                </A>

                {/* Wishlist icon */}
                <button
                  class="absolute top-2 right-2 p-2 z-10"
                  aria-label="Add to Wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
