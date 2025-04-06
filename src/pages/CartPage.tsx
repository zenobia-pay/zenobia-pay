import { Component, createSignal, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import { CartItem, Product } from "../types";
import { getProductById } from "../data/products";

const CartPage: Component = () => {
  // In a real app, this would come from a store or context
  const [cartItems, setCartItems] = createSignal<CartItem[]>([
    {
      product: getProductById("1")!,
      quantity: 1,
      color: "white",
      size: "42",
    },
    {
      product: getProductById("3")!,
      quantity: 1,
      color: "black",
    },
  ]);

  const [subtotal, setSubtotal] = createSignal(0);
  const [tax, setTax] = createSignal(0);
  const [shipping, setShipping] = createSignal(15);
  const [total, setTotal] = createSignal(0);

  createEffect(() => {
    const itemsSubtotal = cartItems().reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    setSubtotal(itemsSubtotal);
    setTax(Math.round(itemsSubtotal * 0.08 * 100) / 100); // 8% tax rate
    setTotal(subtotal() + tax() + shipping());
  });

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  return (
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-serif mb-8">Shopping Bag</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div class="col-span-2">
          {cartItems().length === 0 ? (
            <div class="text-center py-8">
              <p class="text-gray-500 mb-6">Your shopping bag is empty</p>
              <A
                href="/products"
                class="inline-block bg-black text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-gray-800"
              >
                Continue Shopping
              </A>
            </div>
          ) : (
            <div class="border-t border-gray-200">
              {cartItems().map((item) => (
                <div class="py-8 border-b border-gray-200">
                  <div class="flex flex-col md:flex-row gap-6">
                    <div class="w-full md:w-36 h-48 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-grow">
                      <div class="flex justify-between">
                        <div>
                          <h3 class="font-medium mb-1">{item.product.name}</h3>
                          <p class="text-sm text-gray-600 mb-4">
                            ${item.product.price.toFixed(2)}
                          </p>
                          {item.color && (
                            <p class="text-sm text-gray-600 mb-1">
                              Color: {item.color}
                            </p>
                          )}
                          {item.size && (
                            <p class="text-sm text-gray-600 mb-1">
                              Size: {item.size}
                            </p>
                          )}
                        </div>
                        <button
                          class="text-sm text-gray-500 hover:text-black"
                          onClick={() => removeItem(item.product.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div class="mt-4 flex items-center">
                        <span class="text-sm mr-3">Quantity:</span>
                        <div class="flex items-center border border-gray-300">
                          <button
                            class="px-3 py-1"
                            onClick={() =>
                              updateItemQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>
                          <span class="px-3 py-1 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            class="px-3 py-1"
                            onClick={() =>
                              updateItemQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div class="flex justify-between items-center mt-8">
            <A href="/products" class="text-sm underline">
              Continue Shopping
            </A>

            <button
              class="px-6 py-2 border border-gray-300 text-sm uppercase tracking-wider hover:bg-gray-100"
              onClick={() => setCartItems([])}
              disabled={cartItems().length === 0}
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div class="col-span-1">
          <div class="bg-gray-50 p-6 sticky top-4">
            <h2 class="text-xl font-serif mb-6">Order Summary</h2>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span>${subtotal().toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span>${shipping().toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Estimated Tax</span>
                <span>${tax().toFixed(2)}</span>
              </div>
              <div class="border-t border-gray-200 pt-4 mt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>${total().toFixed(2)}</span>
              </div>
            </div>

            <A
              href="/checkout"
              class="block w-full bg-black text-white py-3 text-sm uppercase tracking-wider text-center hover:bg-gray-800 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              classList={{ "pointer-events-none": cartItems().length === 0 }}
            >
              Proceed to Checkout
            </A>

            <div class="flex flex-col space-y-2">
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span class="text-sm">Secure payment</span>
              </div>
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span class="text-sm">Free shipping & returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
