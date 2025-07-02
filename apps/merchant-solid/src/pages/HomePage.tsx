import { Component, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { getFeaturedProducts } from "../data/products";

const HomePage: Component = () => {
  const featuredProducts = getFeaturedProducts();
  const [hoveredProduct, setHoveredProduct] = createSignal<string | null>(null);

  return (
    <div class="min-h-screen bg-white">
      <main class="max-w-[1920px] mx-auto px-12">
        {/* First Hero Section */}
        <div class="flex mb-16">
          {/* Image Section */}
          <div class="w-1/2">
            <img
              src="https://cdn-static.farfetch-contents.com/cms-ccloud/caas/v1/media/10435964/data/6700738cd0523d7bb489d7af0b23350e/3x4_messaging-side/936/2025-04-25-mw-webapp-packing-with-prada-hero-pre-s-prada-multicategory-img.jpeg"
              alt="The art of packing"
              class="w-full h-[800px] object-cover"
            />
          </div>

          {/* Content Section */}
          <div class="w-1/2 flex items-center justify-center bg-white">
            <div class="max-w-[480px] px-16">
              <h1 class="text-[42px] leading-[1.1] font-light mb-6 font-farfetch">
                The art of living
              </h1>
              <p class="text-[16px] leading-[1.5] mb-8 text-[#222] font-farfetch">
                Just in time for vacation season, get some incredible merch for
                sale.
              </p>
              <button class="border border-black text-[13px] px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
                Explore More
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid Section */}
        <div class="mb-16">
          <div class="grid grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <A
                href={`/products/${product._id}`}
                class="group relative"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div class="relative mb-4 before:content-[''] before:absolute before:inset-0 before:bg-[rgba(34,34,34,.04)]">
                  <div class="relative w-full aspect-[3/4]">
                    <img
                      src={product.secondaryImageUrl}
                      alt={product.name}
                      class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 [transition-timing-function:cubic-bezier(0.66,0,0.2,1)] group-hover:opacity-100"
                    />
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      class="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-300 [transition-timing-function:cubic-bezier(0.66,0,0.2,1)] group-hover:opacity-0"
                    />
                  </div>
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
                <p class="text-sm text-gray-500 mb-1">
                  {product.brand || "Brand"}
                </p>
                <p class="text-sm mb-2">{product.name}</p>
                <p class="text-sm">${(product.price / 100).toLocaleString()}</p>
              </A>
            ))}
          </div>
          <div class="text-center mt-8">
            <button class="border border-black text-[13px] px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
              Shop All
            </button>
          </div>
        </div>

        {/* Second Hero Section */}
        <div class="flex mb-16">
          {/* Image Section */}
          <div class="w-1/2">
            <img
              src="https://cdn-static.farfetch-contents.com/cms-ccloud/caas/v1/media/10435996/data/3034400c9b1af192027f6dce51d6718a/3x4_messaging-side/936/2025-04-25-mw-webapp-retro-sportswear-pre-s-multibrand-activewear-img.jpeg"
              alt="The retro sportswear revival"
              class="w-full h-[800px] object-cover"
            />
          </div>

          {/* Content Section */}
          <div class="w-1/2 flex items-center justify-center bg-white">
            <div class="max-w-[480px] px-16">
              <h2 class="text-[42px] leading-[1.1] font-light mb-6">
                The retro sportswear revival
              </h2>
              <p class="text-[16px] leading-[1.5] mb-8 text-[#222]">
                Shop winning looks with athletic appeal, courtesy of Palm Angels
                and more
              </p>
              <button class="border border-black text-[13px] px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
