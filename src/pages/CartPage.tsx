import { Component } from "solid-js";
import { useCart } from "../context/CartContext";
import { A, useNavigate } from "@solidjs/router";

const CartPage: Component = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } =
    useCart();
  const navigate = useNavigate();

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items().length === 0) {
    return (
      <div class="container mx-auto px-4 py-8 text-center">
        <h1 class="text-3xl font-serif mb-4">Your cart is empty</h1>
        <p class="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <A
          href="/products"
          class="inline-block bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800"
        >
          Continue Shopping
        </A>
      </div>
    );
  }

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-serif mb-8">Shopping Cart</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          {items().map((item) => (
            <div class="flex gap-4 py-4 border-b">
              <div class="w-24 h-24 bg-gray-100">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-grow">
                <h3 class="font-medium">{item.product.name}</h3>
                <p class="text-gray-600">
                  {formatPrice(item.product.price)} x {item.quantity}
                </p>
                {item.color && (
                  <p class="text-sm text-gray-600">Color: {item.color}</p>
                )}
                {item.size && (
                  <p class="text-sm text-gray-600">Size: {item.size}</p>
                )}
              </div>
              <div class="flex flex-col items-end justify-between">
                <button
                  class="text-gray-500 hover:text-gray-700"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove
                </button>
                <div class="flex items-center border border-gray-300">
                  <button
                    class="px-3 py-1 text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      updateQuantity(
                        item.product._id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                  >
                    -
                  </button>
                  <span class="px-3 py-1">{item.quantity}</span>
                  <button
                    class="px-3 py-1 text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div class="bg-gray-50 p-6">
            <h2 class="text-xl font-medium mb-4">Order Summary</h2>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">{formatPrice(totalPrice())}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-medium">Free</span>
              </div>
              <div class="border-t border-gray-200 pt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>
            <A
              href="/checkout"
              class="block w-full bg-black text-white text-center px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800 mt-6"
            >
              Proceed to Checkout
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
