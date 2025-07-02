import { Component, createSignal } from "solid-js";
import { ZenobiaPaymentButton } from "@zenobia/ui-solid";

const DemoPage: Component = () => {
  const [paymentSuccess, setPaymentSuccess] = createSignal(false);
  const [customerName, setCustomerName] = createSignal<string | null>(null);

  // Function to handle successful payment
  const handlePaymentSuccess = (transfer, status) => {
    console.log("Payment successful", transfer, status);
    setPaymentSuccess(true);
    if (status?.customerName) {
      setCustomerName(status.customerName);
    }
  };

  // Function to handle payment errors
  const handlePaymentError = (error: Error) => {
    console.error("Payment failed", error);
  };

  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  // Product details - using the actual Ray-Ban product from the site
  const product = {
    name: "RayBan Wayfarer",
    description: "RayBan Wayfarer in black.",
    price: 1, // 1 cent for demo (original price is 500)
    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/41rNPPdCzqL._SLDPMOBCAROUSELAUTOCROP288221_MCnd_AC_SR462,693_.jpg",
    secondaryImageUrl: "https://www.finestresullarte.info/rivista/immagini/2023/2375/ray-ban-wayfarer-indossati.jpg"
  };

  return (
    <div class="min-h-screen bg-gray-100">
      <div class="max-w-md mx-auto bg-white shadow-md">
        {/* Header */}
        <header class="border-b border-gray-200 p-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm">Secure checkout</span>
            </div>
            <div class="text-lg font-normal tracking-widest">
              Ray-Ban
            </div>
          </div>
        </header>

        {/* Main content */}
        <div class="p-4">
          {paymentSuccess() ? (
            <div class="text-center py-8">
              <div class="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-16 w-16 text-green-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 class="text-2xl font-light mb-4">
                {customerName()
                  ? `Thanks, ${customerName()}!`
                  : "Thank you for your purchase!"}
              </h1>
              <p class="text-gray-600 mb-4">
                Your order has been confirmed.
              </p>
              <button
                onClick={() => setPaymentSuccess(false)}
                class="bg-black text-white px-6 py-2 text-sm hover:opacity-90"
              >
                Return to checkout
              </button>
            </div>
          ) : (
            <>
              <h1 class="text-xl font-medium mb-6">Checkout</h1>
              
              {/* Product details */}
              <div class="mb-6 border-b border-gray-200 pb-6">
                <div class="flex gap-4">
                  <div class="w-24 h-24 flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 class="font-medium">{product.name}</h2>
                    <p class="text-sm text-gray-500 mb-1">{product.description}</p>
                    <p class="font-medium">${formatPrice(product.price)}</p>
                    <p class="text-xs text-gray-500">Quantity: 1</p>
                  </div>
                </div>
              </div>
              
              {/* Order summary */}
              <div class="mb-6 border-b border-gray-200 pb-6">
                <h2 class="text-lg font-medium mb-4">Order Summary</h2>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Subtotal</span>
                  <span>${formatPrice(product.price)}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div class="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${formatPrice(product.price)}</span>
                </div>
              </div>
              
              {/* Payment button */}
              <div class="mb-6">
                <h2 class="text-lg font-medium mb-4">Payment</h2>
                <ZenobiaPaymentButton
                  amount={product.price} // 1 cent request
                  metadata={{
                    amount: product.price,
                    statementItems: [
                      {
                        name: product.name,
                        amount: product.price,
                      },
                    ],
                  }}
                  url={`${window.location.origin}/create-transfer`}
                  buttonText="Pay with Zenobia"
                  buttonClass="w-full bg-black text-white p-4 text-sm hover:opacity-90"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
              
              <div class="text-xs text-gray-500">
                By placing your order, you agree to our{" "}
                <a href="#" class="underline">Terms and Conditions</a> and{" "}
                <a href="#" class="underline">Privacy Policy</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
