import { Component, createSignal } from "solid-js";
import { A } from "@solidjs/router";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
}

const FeaturedProducts: Component = () => {
  const [products] = createSignal<Product[]>([
    {
      id: 1,
      name: "Striped Cotton Shirt",
      brand: "Prada",
      price: 890,
      image: "https://cdn.farfetch.com/product-1.jpg",
    },
    {
      id: 2,
      name: "Bucket Hat",
      brand: "Jacquemus",
      price: 295,
      image: "https://cdn.farfetch.com/product-2.jpg",
    },
    {
      id: 3,
      name: "Wide-Leg Trousers",
      brand: "Bottega Veneta",
      price: 1290,
      image: "https://cdn.farfetch.com/product-3.jpg",
    },
    {
      id: 4,
      name: "Leather Loafers",
      brand: "Gucci",
      price: 795,
      image: "https://cdn.farfetch.com/product-4.jpg",
    },
  ]);

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products().map((product) => (
        <A href={`/product/${product.id}`} class="group">
          <div class="relative aspect-[3/4] mb-4">
            <img
              src={product.image}
              alt={product.name}
              class="w-full h-full object-cover"
            />
            <button
              class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Add to wishlist"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
          <div class="space-y-1">
            <h3 class="text-sm font-medium">{product.brand}</h3>
            <p class="text-sm text-gray-600">{product.name}</p>
            <p class="text-sm">${product.price.toLocaleString()}</p>
          </div>
        </A>
      ))}
    </div>
  );
};

export default FeaturedProducts;
