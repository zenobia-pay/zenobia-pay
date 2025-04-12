import { Component, createSignal, createEffect, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { ZenobiaPaymentButton, TransferStatus } from "@zenobia/ui-solid";
import { CartItem } from "../types";
import { getProductById } from "../data/products";

const CheckoutPage: Component = () => {
  const navigate = useNavigate();
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

  // Payment state
  const [paymentId, setPaymentId] = createSignal<string | null>(null);
  const [paymentStatus, setPaymentStatus] = createSignal<TransferStatus | null>(
    null
  );
  const [error, setError] = createSignal<string | null>(null);
  const [paymentComplete, setPaymentComplete] = createSignal(false);

  createEffect(() => {
    const itemsSubtotal = cartItems().reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    setSubtotal(itemsSubtotal);
    setTax(Math.round(itemsSubtotal * 0.08 * 100) / 100); // 8% tax rate
    setTotal(subtotal() + tax() + shipping());
  });

  const handlePaymentSuccess = (payment: {
    transferRequestId: string;
    merchantId: string;
  }) => {
    console.log("Payment request created:", payment);
    setPaymentId(payment.transferRequestId);
  };

  const handlePaymentError = (err: Error) => {
    console.error("Payment error:", err);
    setError(err.message);
  };

  const handleStatusChange = (status: TransferStatus) => {
    console.log("Payment status changed:", status);
    setPaymentStatus(status);

    // Check if payment is complete
    if (status === TransferStatus.COMPLETED) {
      setPaymentComplete(true);
    }
  };

  return (
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-serif mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <h2 class="text-xl font-serif mb-6">Order Summary</h2>
          <div class="border-t border-gray-200">
            {cartItems().map((item) => (
              <div class="py-6 border-b border-gray-200">
                <div class="flex gap-6">
                  <div class="w-24 h-32 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-grow">
                    <h3 class="font-medium mb-1">{item.product.name}</h3>
                    <p class="text-sm text-gray-600 mb-2">
                      ${item.product.price.toFixed(2)} x {item.quantity}
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
                  <div class="text-right">
                    <p class="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div class="mt-6 space-y-4">
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
        </div>

        {/* Payment */}
        <div>
          <h2 class="text-xl font-serif mb-6">Payment</h2>

          <div class="bg-gray-50 p-6 mb-6">
            <h3 class="font-medium mb-4">Shipping Address</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                />
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">State</label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  class="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6">
            <h3 class="font-medium mb-4">Payment Method</h3>
            <p class="text-sm text-gray-600 mb-6">
              We use Zenobia Pay for secure, contactless payments. No credit
              card required.
            </p>

            <Show
              when={!paymentComplete()}
              fallback={
                <div class="text-center">
                  <p class="text-green-600 font-medium mb-4">
                    Payment Successful!
                  </p>
                  <button
                    class="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800"
                    onClick={() => navigate("/")}
                  >
                    Return to Home
                  </button>
                </div>
              }
            >
              <ZenobiaPaymentButton
                amount={total()}
                url={`${window.location.origin}/create-transfer`}
                statementItems={cartItems().map((item) => ({
                  name: item.product.name,
                  amount: item.product.price * item.quantity,
                }))}
                buttonText="Pay with Zenobia"
                buttonClass="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onStatusChange={handleStatusChange}
              />
            </Show>
            {error() && <p class="text-red-600 text-sm mt-2">{error()}</p>}
          </div>

          <div class="mt-6">
            <A href="/cart" class="text-sm underline">
              Return to Cart
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
