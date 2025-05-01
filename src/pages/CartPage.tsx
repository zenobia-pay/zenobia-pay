import { Component, createSignal } from "solid-js";
import { useCart } from "../context/CartContext";
import { A } from "@solidjs/router";

const CartPage: Component = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();
  const [editingQuantity, setEditingQuantity] = createSignal<string | null>(
    null
  );

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div class="min-h-screen bg-white">
      {/* Top Banner */}
      <div class="w-full text-center py-2 text-xs">
        Prices include all duties & tariffs
      </div>

      <div class="max-w-[1920px] mx-auto px-12 py-8">
        <div class="flex justify-between items-center mb-12">
          <h1 class="text-[32px] font-farfetch font-light">Shopping Bag</h1>
          <A href="/products" class="text-sm underline hover:opacity-70">
            Continue Shopping
          </A>
        </div>

        {items().length === 0 ? (
          <div class="text-center py-16">
            <p class="text-lg mb-6">Your shopping bag is empty</p>
            <A
              href="/products"
              class="inline-block border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-colors"
            >
              Shop Now
            </A>
          </div>
        ) : (
          <div class="grid grid-cols-12 gap-12">
            {/* Items List */}
            <div class="col-span-8">
              <div class="flex items-center text-sm mb-4">
                <span>Import duties are included</span>
                <button class="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {items().map((item) => (
                <div class="border-t border-gray-200 py-8">
                  <div class="flex gap-8">
                    <div class="w-[120px] aspect-[3/4]">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-grow">
                      <div class="flex justify-between">
                        <div>
                          <p class="text-sm text-gray-500 mb-1">
                            {item.product.brand}
                          </p>
                          <p class="text-sm mb-2">{item.product.name}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          class="text-2xl leading-none hover:opacity-70"
                        >
                          ×
                        </button>
                      </div>

                      <div class="space-y-4">
                        <div class="flex items-center">
                          <span class="text-sm mr-4">Size</span>
                          <span class="text-sm font-medium">
                            {item.size || "One Size"}
                          </span>
                        </div>

                        <div class="flex items-center">
                          <span class="text-sm mr-4">Quantity</span>
                          <div class="relative">
                            <select
                              class="appearance-none pl-4 pr-8 py-2 border border-gray-300 bg-white text-sm"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.product._id,
                                  parseInt(e.currentTarget.value)
                                )
                              }
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option value={num}>{num}</option>
                              ))}
                            </select>
                            <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
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
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center">
                          <A
                            href="#"
                            class="text-sm underline hover:opacity-70 mr-4"
                          >
                            Move to Wishlist
                          </A>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm">${formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div class="col-span-4">
              <div class="sticky top-8">
                <h2 class="text-xl mb-6">Summary</h2>
                <div class="space-y-4 mb-6">
                  <div class="flex justify-between">
                    <span class="text-sm">Subtotal</span>
                    <span class="text-sm">${formatPrice(totalPrice())}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm">Delivery</span>
                    <span class="text-sm">$0.00</span>
                  </div>
                </div>
                <div class="flex justify-between border-t border-black pt-4 mb-6">
                  <span class="text-sm">Total</span>
                  <div class="text-right">
                    <p class="text-sm">USD ${formatPrice(totalPrice())}</p>
                    <p class="text-xs text-gray-500">Import duties included</p>
                  </div>
                </div>
                <A
                  href="/checkout"
                  class="block w-full bg-black text-white text-center py-4 text-sm hover:opacity-90 mb-4"
                >
                  Go To Checkout
                </A>

                {/* Bottom Info Cards */}
                <div class="grid grid-cols-3 gap-4 mt-12">
                  <div class="text-center">
                    <div class="flex justify-center mb-2">
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
                          stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                    <p class="text-sm font-medium">30-day free returns</p>
                  </div>
                  <div class="text-center">
                    <div class="flex justify-center mb-2">
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
                          stroke-width="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <p class="text-sm font-medium">
                      4.7/5 stars and 25,000+ reviews
                    </p>
                  </div>
                  <div class="text-center">
                    <div class="flex justify-center mb-2">
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
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <p class="text-sm font-medium">Not ready to commit?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
