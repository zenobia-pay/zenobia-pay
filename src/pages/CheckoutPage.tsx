import { Component, createSignal, Show } from "solid-js";
import { useCart } from "../context/CartContext";
import { useNavigate } from "@solidjs/router";
import { ZenobiaPaymentButton } from "@zenobia/ui-solid";

const CheckoutPage: Component = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentComplete, setPaymentComplete] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [paymentStatus, setPaymentStatus] = createSignal<string | null>(null);

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
    clearCart();
  };

  const handlePaymentError = (err: Error) => {
    setError(err.message);
  };

  const handleStatusChange = (status: string) => {
    setPaymentStatus(status);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (items().length === 0) {
    return (
      <div class="container mx-auto px-4 py-8 text-center">
        <h1 class="text-3xl font-serif mb-4">Your cart is empty</h1>
        <p class="text-gray-600 mb-8">
          Please add items to your cart before checking out.
        </p>
        <a
          href="/products"
          class="inline-block bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-serif mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 class="text-xl font-medium mb-4">Order Summary</h2>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="border-b border-gray-200 pb-4 mb-4">
              {items().map((item) => (
                <div class="flex justify-between mb-2">
                  <div>
                    <span class="font-medium">{item.product.name}</span>
                    <span class="text-gray-500 text-sm ml-2">
                      x {item.quantity}
                    </span>
                  </div>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

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
          </div>
        </div>

        <div>
          <h2 class="text-xl font-medium mb-4">Payment</h2>
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
                </div>
              }
            >
              <ZenobiaPaymentButton
                amount={totalPrice()}
                url={`${window.location.origin}/create-transfer`}
                statementItems={items().map((item) => ({
                  name: item.product.name + " " + item.color + " " + item.size,
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
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
