import { Component } from "solid-js";
import { A } from "@solidjs/router";
import FeaturedProducts from "../components/products/FeaturedProducts";

const HomePage: Component = () => {
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
                The art of packing
              </h1>
              <p class="text-[16px] leading-[1.5] mb-8 text-[#222] font-farfetch">
                Just in time for vacation season, FARFETCH joins three New
                York-based creatives as they edit their favorite pieces from the
                Prada Days of Summer collection for the perfect getaway
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
            <A href="/products/1" class="group">
              <div class="relative mb-4">
                <img
                  src="https://img.ssensemedia.com/images/b_white,c_lpad,g_center,h_1412,w_940/c_scale,h_960/f_auto,dpr_2.0/221404M192009_1/prada-brown-striped-bowling-shirt.jpg"
                  alt="Prada Striped Bowling Shirt"
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
              <p class="text-sm text-gray-500 mb-1">Prada</p>
              <p class="text-sm mb-2">Cotton bowling shirt</p>
              <p class="text-sm">$1,750</p>
            </A>

            <A href="/products/2" class="group">
              <div class="relative mb-4">
                <img
                  src="https://img.ssensemedia.com/images/b_white,c_lpad,g_center,h_1412,w_940/c_scale,h_960/f_auto,dpr_2.0/231404M134001_1/prada-brown-bucket-hat.jpg"
                  alt="Prada Bucket Hat"
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
              <p class="text-sm text-gray-500 mb-1">Prada</p>
              <p class="text-sm mb-2">Cotton bucket hat</p>
              <p class="text-sm">$850</p>
            </A>

            <A href="/products/3" class="group">
              <div class="relative mb-4">
                <img
                  src="https://img.ssensemedia.com/images/b_white,c_lpad,g_center,h_1412,w_940/c_scale,h_960/f_auto,dpr_2.0/231404M190000_1/prada-brown-trousers.jpg"
                  alt="Prada Trousers"
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
              <p class="text-sm text-gray-500 mb-1">Prada</p>
              <p class="text-sm mb-2">Belted trousers</p>
              <p class="text-sm">$4,800</p>
            </A>

            <A href="/products/4" class="group">
              <div class="relative mb-4">
                <img
                  src="https://img.ssensemedia.com/images/b_white,c_lpad,g_center,h_1412,w_940/c_scale,h_960/f_auto,dpr_2.0/231404M234001_1/prada-beige-slides.jpg"
                  alt="Prada Slides"
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
              <p class="text-sm text-gray-500 mb-1">Prada</p>
              <p class="text-sm mb-2">Logo slides</p>
              <p class="text-sm">$1,250</p>
            </A>
          </div>
          <div class="text-center mt-8">
            <button class="border border-black text-[13px] px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
              Shop Prada
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

        {/* New Arrivals Section */}
        <div class="mb-16">
          <h3 class="text-[16px] mb-8">
            New in: handpicked daily from the world's best brands and boutiques
          </h3>
          <div class="grid grid-cols-4 gap-6">
            <A href="/products/5" class="group">
              <div class="relative mb-4">
                <img
                  src="https://img.ssensemedia.com/images/b_white,c_lpad,g_center,h_1412,w_940/c_scale,h_960/f_auto,dpr_2.0/232338M513001_1/versace-black-leather-jacket.jpg"
                  alt="Versace Leather Jacket"
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
              <p class="text-sm text-gray-500 mb-1">Versace</p>
              <p class="text-sm mb-2">Leather jacket</p>
              <p class="text-sm">$3,900</p>
            </A>

            <A href="/products/6" class="group">
              <div class="relative mb-4">
                <img
                  src="https://img.ssensemedia.com/images/b_white,c_lpad,g_center,h_1412,w_940/c_scale,h_960/f_auto,dpr_2.0/232338M484001_1/valentino-garavani-black-pouch.jpg"
                  alt="Valentino Garavani Pouch"
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
              <p class="text-sm text-gray-500 mb-1">Valentino Garavani</p>
              <p class="text-sm mb-2">VLOGO SIGNATURE GRAINY CALFSKIN POUCH</p>
              <p class="text-sm">$1,250</p>
            </A>

            <A href="/products/7" class="group">
              <div class="relative mb-4">
                <img
                  src="https://img.ssensemedia.com/images/b_white,c_lpad,g_center,h_1412,w_940/c_scale,h_960/f_auto,dpr_2.0/232451M192003_1/versace-white-silk-shirt.jpg"
                  alt="Versace Silk Shirt"
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
              <p class="text-sm text-gray-500 mb-1">Versace</p>
              <p class="text-sm mb-2">Coral Reef button-up shirt</p>
              <p class="text-sm">$750</p>
            </A>

            <A href="/products/8" class="group">
              <div class="relative mb-4">
                <img
                  src="https://img.ssensemedia.com/images/b_white,c_lpad,g_center,h_1412,w_940/c_scale,h_960/f_auto,dpr_2.0/232451M237001_1/martine-rose-black-slides.jpg"
                  alt="Martine Rose Slides"
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
              <p class="text-sm text-gray-500 mb-1">Martine Rose</p>
              <p class="text-sm mb-2">monogram-embossed leather slides</p>
              <p class="text-sm">$870</p>
            </A>
          </div>
          <div class="text-center mt-8">
            <button class="border border-black text-[13px] px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300">
              Shop Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
