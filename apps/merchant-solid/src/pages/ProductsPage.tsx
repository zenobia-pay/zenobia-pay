import { Component, createSignal, createEffect, Show } from "solid-js";
import { A, useParams, useSearchParams } from "@solidjs/router";
import { getProducts } from "../data/products";
import { Product } from "../types";

type CategoryInfo = {
  title: string;
  description: string;
};

type CategoryDescriptions = {
  [key: string]: CategoryInfo;
};

type FilterOptions = {
  [key: string]: string[];
};

const CATEGORY_DESCRIPTIONS: CategoryDescriptions = {
  coats: {
    title: "Designer Coats for Men",
    description:
      "Statement pieces or winter warmers — we've got an extensive range of designer coats, covering all your favorite brands. Moncler and Canada Goose's signature insulating puffer jackets will shield you from the elements, whilst Thom Browne offers a mix of classic and contemporary styles.",
  },
  shoes: {
    title: "Designer Shoes for Men",
    description:
      "Step into luxury with our curated selection of designer shoes. From classic leather oxfords to contemporary sneakers, discover footwear that combines style and craftsmanship from the world's leading brands.",
  },
  bags: {
    title: "Designer Bags for Men",
    description:
      "Elevate your everyday carry with our selection of designer bags. From practical backpacks to sophisticated briefcases, find the perfect bag to match your style and needs.",
  },
  // Add more categories as needed
};

const FILTER_OPTIONS: FilterOptions = {
  coats: [
    "Single Breasted Coats",
    "Burberry",
    "AMI Paris",
    "Trench Coats",
    "Dolce & Gabbana",
    "Double Breasted Coats",
    "Polo Ralph Lauren",
  ],
  shoes: [
    "Sneakers",
    "Boots",
    "Loafers",
    "Oxford Shoes",
    "Sandals",
    "Slip-ons",
    "Designer Shoes",
  ],
  bags: [
    "Backpacks",
    "Briefcases",
    "Tote Bags",
    "Messenger Bags",
    "Travel Bags",
    "Leather Bags",
    "Designer Bags",
  ],
  // Add more categories as needed
};

const ProductsPage: Component = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = createSignal<Product[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [selectedFilters, setSelectedFilters] = createSignal<string[]>([]);

  const category = () => params.category || searchParams.category || "";

  const categoryInfo = () =>
    CATEGORY_DESCRIPTIONS[category() as keyof typeof CATEGORY_DESCRIPTIONS] ||
    null;
  const availableFilters = () =>
    FILTER_OPTIONS[category() as keyof typeof FILTER_OPTIONS] || [];

  createEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = getProducts();
        setProducts(allProducts.filter((p) => p.category === category()));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  });

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div class="min-h-screen bg-white">
      <Show
        when={categoryInfo()}
        fallback={
          <div class="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 class="text-2xl font-farfetch mb-4">Page not found :(</h1>
            <A href="/" class="text-black underline hover:opacity-70">
              Return to Homepage
            </A>
          </div>
        }
      >
        {/* Breadcrumb */}
        <div class="max-w-[1920px] mx-auto px-12 py-4">
          <div class="flex items-center space-x-2 text-sm">
            <A href="/" class="hover:opacity-70">
              Home
            </A>
            <span>/</span>
            <A href="/men" class="hover:opacity-70">
              Men
            </A>
            <span>/</span>
            <span class="text-gray-500">{category()}</span>
          </div>
        </div>

        {/* Header Section */}
        <div class="max-w-[1920px] mx-auto px-12 py-8">
          <h1 class="text-[32px] font-farfetch font-light mb-4">
            {categoryInfo()?.title}
          </h1>
          <p class="text-[16px] font-farfetch text-[#222] max-w-[800px] mb-8">
            {categoryInfo()?.description}
          </p>

          {/* Filter Chips */}
          <div class="flex flex-wrap gap-3 mb-8">
            <button
              class="px-4 py-2 border border-black text-sm font-farfetch flex items-center gap-2"
              onClick={() => {}}
            >
              All Filters
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            {availableFilters().map((filter) => (
              <button
                class={`px-4 py-2 border text-sm font-farfetch hover:border-black transition-colors ${
                  selectedFilters().includes(filter)
                    ? "border-black"
                    : "border-gray-300"
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </button>
            ))}
            <button
              class="px-4 py-2 border border-gray-300 text-sm font-farfetch flex items-center gap-2"
              onClick={() => {}}
            >
              Sort by
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Products Grid */}
          <div class="grid grid-cols-4 gap-6">
            {loading()
              ? Array(8)
                  .fill(0)
                  .map(() => (
                    <div class="animate-pulse">
                      <div class="bg-gray-200 aspect-[3/4] mb-4" />
                      <div class="h-4 bg-gray-200 w-1/2 mb-2" />
                      <div class="h-4 bg-gray-200 w-3/4 mb-2" />
                      <div class="h-4 bg-gray-200 w-1/4" />
                    </div>
                  ))
              : products().map((product) => (
                  <A href={`/products/${product._id}`} class="group">
                    <div class="relative mb-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        class="w-full aspect-[3/4] object-cover"
                      />
                      <button class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <p class="text-sm text-gray-500 mb-1">{product.brand}</p>
                    <p class="text-sm mb-2">{product.name}</p>
                    <p class="text-sm">${product.price}</p>
                  </A>
                ))}
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ProductsPage;
