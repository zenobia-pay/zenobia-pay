import { Component, createSignal } from "solid-js";
import { A } from "@solidjs/router";

const Navigation: Component = () => {
  const [activeMenu, setActiveMenu] = createSignal<string | null>(null);
  const [menuTimeout, setMenuTimeout] = createSignal<NodeJS.Timeout | null>(
    null
  );

  const handleMouseEnter = (menu: string) => {
    if (menuTimeout()) {
      clearTimeout(menuTimeout()!);
      setMenuTimeout(null);
    }
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
    }, 200); // 200ms delay before closing
    setMenuTimeout(timeout);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div class="w-full bg-[#f5f5f5] text-center py-2 text-sm">
        Free shipping on orders over $200 | Plus free returns for 30 days
      </div>

      <nav class="relative bg-white">
        {/* Primary Navigation */}
        <div class="flex justify-between items-center px-12 py-4">
          <div class="flex space-x-8">
            <A
              href="/women"
              class="text-sm hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("women")}
              onMouseLeave={handleMouseLeave}
            >
              Womenswear
            </A>
            <A
              href="/men"
              class="text-sm hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("men")}
              onMouseLeave={handleMouseLeave}
            >
              Menswear
            </A>
            <A
              href="/kids"
              class="text-sm hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("kids")}
              onMouseLeave={handleMouseLeave}
            >
              Kidswear
            </A>
          </div>

          <A
            href="/"
            class="text-2xl font-normal tracking-widest font-farfetch"
          >
            NOT FARFETCH
          </A>

          <div class="flex items-center space-x-6">
            <button class="hover:opacity-70">🇺🇸</button>
            <A href="/account" class="hover:opacity-70">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </A>
            <A href="/wishlist" class="hover:opacity-70">
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
            </A>
            <A href="/cart" class="hover:opacity-70">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </A>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div class="flex justify-between items-center px-12 py-3 border-t border-b border-gray-200">
          <div class="flex space-x-8 text-sm">
            <A href="/new-in" class="hover:opacity-70">
              New in
            </A>
            <A href="/brands" class="hover:opacity-70">
              Brands
            </A>
            <A
              href="/clothing"
              class="hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("clothing")}
              onMouseLeave={handleMouseLeave}
            >
              Clothing
            </A>
            <A
              href="/shoes"
              class="hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("shoes")}
              onMouseLeave={handleMouseLeave}
            >
              Shoes
            </A>
            <A
              href="/sneakers"
              class="hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("sneakers")}
              onMouseLeave={handleMouseLeave}
            >
              Sneakers
            </A>
            <A
              href="/bags"
              class="hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("bags")}
              onMouseLeave={handleMouseLeave}
            >
              Bags
            </A>
            <A
              href="/accessories"
              class="hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("accessories")}
              onMouseLeave={handleMouseLeave}
            >
              Accessories
            </A>
            <A
              href="/watches"
              class="hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("watches")}
              onMouseLeave={handleMouseLeave}
            >
              Watches
            </A>
            <A
              href="/homeware"
              class="hover:opacity-70"
              onMouseEnter={() => handleMouseEnter("homeware")}
              onMouseLeave={handleMouseLeave}
            >
              Homeware
            </A>
            <A href="/sale" class="text-red-600 hover:opacity-70">
              Sale
            </A>
          </div>

          <div class="relative">
            <input
              type="search"
              placeholder="Search"
              class="pl-10 pr-4 py-2 w-[300px] text-sm border-none bg-[#f8f8f8] rounded-none focus:outline-none focus:ring-0"
            />
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        {(activeMenu() === "men" ||
          activeMenu() === "women" ||
          activeMenu() === "kids") && (
          <div
            class="absolute left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50"
            onMouseEnter={() => handleMouseEnter(activeMenu()!)}
            onMouseLeave={handleMouseLeave}
          >
            <div class="container mx-auto px-4 py-8">
              <div class="grid grid-cols-4 gap-8">
                <div>
                  <h3 class="font-medium mb-4">CLOTHING</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href={`/${activeMenu()}/all-clothing`}
                        class="text-sm hover:text-gray-600"
                      >
                        All clothing
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/activewear`}
                        class="text-sm hover:text-gray-600"
                      >
                        Activewear
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/coats`}
                        class="text-sm hover:text-gray-600"
                      >
                        Coats
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/jeans`}
                        class="text-sm hover:text-gray-600"
                      >
                        Jeans
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/jackets`}
                        class="text-sm hover:text-gray-600"
                      >
                        Jackets
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/shirts`}
                        class="text-sm hover:text-gray-600"
                      >
                        Shirts
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/shorts`}
                        class="text-sm hover:text-gray-600"
                      >
                        Shorts
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/sweaters`}
                        class="text-sm hover:text-gray-600"
                      >
                        Sweaters & knitwear
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/t-shirts`}
                        class="text-sm hover:text-gray-600"
                      >
                        T-shirts & vests
                      </A>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-medium mb-4">SHOES</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href={`/${activeMenu()}/sneakers`}
                        class="text-sm hover:text-gray-600"
                      >
                        Sneakers
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/boots`}
                        class="text-sm hover:text-gray-600"
                      >
                        Boots
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/sandals`}
                        class="text-sm hover:text-gray-600"
                      >
                        Sandals
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/loafers`}
                        class="text-sm hover:text-gray-600"
                      >
                        Loafers
                      </A>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-medium mb-4">ACCESSORIES</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href={`/${activeMenu()}/bags`}
                        class="text-sm hover:text-gray-600"
                      >
                        Bags
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/jewelry`}
                        class="text-sm hover:text-gray-600"
                      >
                        Jewelry
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/watches`}
                        class="text-sm hover:text-gray-600"
                      >
                        Watches
                      </A>
                    </li>
                    <li>
                      <A
                        href={`/${activeMenu()}/sunglasses`}
                        class="text-sm hover:text-gray-600"
                      >
                        Sunglasses
                      </A>
                    </li>
                  </ul>
                </div>
                <div class="relative h-full">
                  <img
                    src={`https://cdn.farfetch.com/${activeMenu()}-menu-image.jpg`}
                    alt={`${activeMenu()} Fashion`}
                    class="w-full h-64 object-cover"
                  />
                  <div class="absolute bottom-4 left-4">
                    <p class="text-white text-sm mb-2">Featured</p>
                    <h4 class="text-white text-lg font-medium mb-4">
                      {activeMenu() === "men"
                        ? "Men's Summer Essentials"
                        : activeMenu() === "women"
                        ? "Women's Summer Essentials"
                        : "Kids' Summer Essentials"}
                    </h4>
                    <A
                      href={`/${activeMenu()}/summer-essentials`}
                      class="bg-white text-black px-4 py-2 text-sm hover:bg-black hover:text-white transition duration-300"
                    >
                      Shop Now
                    </A>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Mega Menus */}
        {activeMenu() === "clothing" && (
          <div
            class="absolute left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50"
            onMouseEnter={() => handleMouseEnter("clothing")}
            onMouseLeave={handleMouseLeave}
          >
            <div class="container mx-auto px-4 py-8">
              <div class="grid grid-cols-4 gap-8">
                <div>
                  <h3 class="font-medium mb-4">WOMEN'S CLOTHING</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href="/women/dresses"
                        class="text-sm hover:text-gray-600"
                      >
                        Dresses
                      </A>
                    </li>
                    <li>
                      <A href="/women/tops" class="text-sm hover:text-gray-600">
                        Tops
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/jeans"
                        class="text-sm hover:text-gray-600"
                      >
                        Jeans
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/jackets"
                        class="text-sm hover:text-gray-600"
                      >
                        Jackets
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/skirts"
                        class="text-sm hover:text-gray-600"
                      >
                        Skirts
                      </A>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-medium mb-4">MEN'S CLOTHING</h3>
                  <ul class="space-y-2">
                    <li>
                      <A href="/men/shirts" class="text-sm hover:text-gray-600">
                        Shirts
                      </A>
                    </li>
                    <li>
                      <A
                        href="/men/t-shirts"
                        class="text-sm hover:text-gray-600"
                      >
                        T-shirts
                      </A>
                    </li>
                    <li>
                      <A href="/men/jeans" class="text-sm hover:text-gray-600">
                        Jeans
                      </A>
                    </li>
                    <li>
                      <A
                        href="/men/jackets"
                        class="text-sm hover:text-gray-600"
                      >
                        Jackets
                      </A>
                    </li>
                    <li>
                      <A href="/men/suits" class="text-sm hover:text-gray-600">
                        Suits
                      </A>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-medium mb-4">KIDS' CLOTHING</h3>
                  <ul class="space-y-2">
                    <li>
                      <A href="/kids/boys" class="text-sm hover:text-gray-600">
                        Boys
                      </A>
                    </li>
                    <li>
                      <A href="/kids/girls" class="text-sm hover:text-gray-600">
                        Girls
                      </A>
                    </li>
                    <li>
                      <A href="/kids/baby" class="text-sm hover:text-gray-600">
                        Baby
                      </A>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu() === "shoes" && (
          <div
            class="absolute left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50"
            onMouseEnter={() => handleMouseEnter("shoes")}
            onMouseLeave={handleMouseLeave}
          >
            <div class="container mx-auto px-4 py-8">
              <div class="grid grid-cols-4 gap-8">
                <div>
                  <h3 class="font-medium mb-4">WOMEN'S SHOES</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href="/women/shoes/heels"
                        class="text-sm hover:text-gray-600"
                      >
                        Heels
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/shoes/boots"
                        class="text-sm hover:text-gray-600"
                      >
                        Boots
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/shoes/flats"
                        class="text-sm hover:text-gray-600"
                      >
                        Flats
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/shoes/sandals"
                        class="text-sm hover:text-gray-600"
                      >
                        Sandals
                      </A>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-medium mb-4">MEN'S SHOES</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href="/men/shoes/boots"
                        class="text-sm hover:text-gray-600"
                      >
                        Boots
                      </A>
                    </li>
                    <li>
                      <A
                        href="/men/shoes/loafers"
                        class="text-sm hover:text-gray-600"
                      >
                        Loafers
                      </A>
                    </li>
                    <li>
                      <A
                        href="/men/shoes/oxfords"
                        class="text-sm hover:text-gray-600"
                      >
                        Oxfords
                      </A>
                    </li>
                    <li>
                      <A
                        href="/men/shoes/sandals"
                        class="text-sm hover:text-gray-600"
                      >
                        Sandals
                      </A>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-medium mb-4">KIDS' SHOES</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href="/kids/shoes/boys"
                        class="text-sm hover:text-gray-600"
                      >
                        Boys
                      </A>
                    </li>
                    <li>
                      <A
                        href="/kids/shoes/girls"
                        class="text-sm hover:text-gray-600"
                      >
                        Girls
                      </A>
                    </li>
                    <li>
                      <A
                        href="/kids/shoes/baby"
                        class="text-sm hover:text-gray-600"
                      >
                        Baby
                      </A>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu() === "bags" && (
          <div
            class="absolute left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50"
            onMouseEnter={() => handleMouseEnter("bags")}
            onMouseLeave={handleMouseLeave}
          >
            <div class="container mx-auto px-4 py-8">
              <div class="grid grid-cols-4 gap-8">
                <div>
                  <h3 class="font-medium mb-4">WOMEN'S BAGS</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href="/women/bags/handbags"
                        class="text-sm hover:text-gray-600"
                      >
                        Handbags
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/bags/clutches"
                        class="text-sm hover:text-gray-600"
                      >
                        Clutches
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/bags/totes"
                        class="text-sm hover:text-gray-600"
                      >
                        Totes
                      </A>
                    </li>
                    <li>
                      <A
                        href="/women/bags/backpacks"
                        class="text-sm hover:text-gray-600"
                      >
                        Backpacks
                      </A>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-medium mb-4">MEN'S BAGS</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href="/men/bags/backpacks"
                        class="text-sm hover:text-gray-600"
                      >
                        Backpacks
                      </A>
                    </li>
                    <li>
                      <A
                        href="/men/bags/briefcases"
                        class="text-sm hover:text-gray-600"
                      >
                        Briefcases
                      </A>
                    </li>
                    <li>
                      <A
                        href="/men/bags/messenger"
                        class="text-sm hover:text-gray-600"
                      >
                        Messenger Bags
                      </A>
                    </li>
                    <li>
                      <A
                        href="/men/bags/totes"
                        class="text-sm hover:text-gray-600"
                      >
                        Totes
                      </A>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-medium mb-4">ACCESSORIES</h3>
                  <ul class="space-y-2">
                    <li>
                      <A
                        href="/accessories/wallets"
                        class="text-sm hover:text-gray-600"
                      >
                        Wallets
                      </A>
                    </li>
                    <li>
                      <A
                        href="/accessories/cardholders"
                        class="text-sm hover:text-gray-600"
                      >
                        Cardholders
                      </A>
                    </li>
                    <li>
                      <A
                        href="/accessories/pouches"
                        class="text-sm hover:text-gray-600"
                      >
                        Pouches
                      </A>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
