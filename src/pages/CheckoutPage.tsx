import { Component, createSignal, Show } from "solid-js";
import { useCart } from "../context/CartContext";
import { A } from "@solidjs/router";
import { ZenobiaPaymentButton } from "@zenobia/ui-solid";

type CheckoutStep = "address" | "delivery" | "payment";

const CheckoutPage: Component = () => {
  const { items, totalPrice } = useCart();
  const [currentStep, setCurrentStep] = createSignal<CheckoutStep>("address");
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [address1, setAddress1] = createSignal("");
  const [address2, setAddress2] = createSignal("");
  const [city, setCity] = createSignal("");
  const [state, setState] = createSignal("");
  const [zipCode, setZipCode] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [useBillingAddress, setUseBillingAddress] = createSignal(false);
  const [countryCode, setCountryCode] = createSignal("+1");
  const [addressComplete, setAddressComplete] = createSignal(false);
  const [deliveryComplete, setDeliveryComplete] = createSignal(false);
  const [selectedPayment, setSelectedPayment] = createSignal<string | null>(
    null
  );
  const [paymentError, setPaymentError] = createSignal<string | null>(null);
  const [paymentMethodConfirmed, setPaymentMethodConfirmed] =
    createSignal(false);

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const handleAddressSubmit = (e: Event) => {
    e.preventDefault();
    setAddressComplete(true);
    setCurrentStep("delivery");
  };

  const handleDeliverySubmit = (e: Event) => {
    e.preventDefault();
    setDeliveryComplete(true);
    setCurrentStep("payment");
  };

  const handleEditAddress = () => {
    setCurrentStep("address");
  };

  const handleEditDelivery = () => {
    setCurrentStep("delivery");
  };

  const handlePaymentSuccess = () => {
    // Handle successful payment
    console.log("Payment successful");
  };

  const handlePaymentError = (error: Error) => {
    setPaymentError(error.message);
  };

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    setPaymentError(null);
  };

  const handleConfirmPaymentMethod = () => {
    if (!selectedPayment()) {
      setPaymentError("Please select a payment method");
      return;
    }
    setPaymentMethodConfirmed(true);
    setPaymentError(null);
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
    <div class="min-h-screen bg-white">
      {/* Header */}
      <header class="border-b border-gray-200">
        <div class="max-w-[1920px] mx-auto px-12 py-4 flex justify-between items-center">
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
          <A
            href="/"
            class="text-2xl font-normal tracking-widest font-farfetch"
          >
            FARFETCH
          </A>
          <div class="flex items-center gap-2">
            <span class="text-sm">Need help?</span>
            <a href="tel:+1-646-791-3768" class="text-sm underline">
              +1 (646-791-3768)
            </a>
          </div>
        </div>
      </header>

      <div class="max-w-[1920px] mx-auto px-12 py-8">
        <div class="grid grid-cols-12 gap-12">
          {/* Main Content */}
          <div class="col-span-8">
            {/* Delivery Address Section */}
            <div class="mb-8">
              <Show
                when={!addressComplete()}
                fallback={
                  <div class="flex items-start justify-between mb-8">
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <h2 class="text-2xl font-light">Delivery Address</h2>
                      </div>
                      <div class="ml-7">
                        <p class="text-sm">
                          {firstName()} {lastName()}
                        </p>
                        <p class="text-sm">{address1()}</p>
                        {address2() && <p class="text-sm">{address2()}</p>}
                        <p class="text-sm">
                          {city()}, {state()} {zipCode()}
                        </p>
                        <p class="text-sm">United States</p>
                      </div>
                    </div>
                    <button
                      onClick={handleEditAddress}
                      class="text-sm underline hover:opacity-70"
                    >
                      Edit
                    </button>
                  </div>
                }
              >
                <div>
                  <h1 class="text-2xl font-light mb-8">Delivery Address</h1>
                  <form onSubmit={handleAddressSubmit}>
                    <p class="text-sm mb-6">Add your delivery address</p>
                    <p class="text-xs text-gray-500 mb-4">*Required fields</p>

                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label class="block text-sm mb-2">First name*</label>
                        <input
                          type="text"
                          required
                          class="w-full p-3 border border-gray-300 text-sm"
                          value={firstName()}
                          onInput={(e) => setFirstName(e.currentTarget.value)}
                        />
                      </div>
                      <div>
                        <label class="block text-sm mb-2">Last name*</label>
                        <input
                          type="text"
                          required
                          class="w-full p-3 border border-gray-300 text-sm"
                          value={lastName()}
                          onInput={(e) => setLastName(e.currentTarget.value)}
                        />
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="block text-sm mb-2">Country/region*</label>
                      <div class="relative">
                        <select class="w-full p-3 border border-gray-300 text-sm appearance-none bg-white">
                          <option value="US">United States (USD$)</option>
                        </select>
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
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

                    <div class="mb-4">
                      <label class="block text-sm mb-2">Address*</label>
                      <input
                        type="text"
                        placeholder="Start typing to search your address"
                        required
                        class="w-full p-3 border border-gray-300 text-sm mb-2"
                        value={address1()}
                        onInput={(e) => setAddress1(e.currentTarget.value)}
                      />
                      <input
                        type="text"
                        class="w-full p-3 border border-gray-300 text-sm"
                        value={address2()}
                        onInput={(e) => setAddress2(e.currentTarget.value)}
                      />
                      <p class="text-xs text-gray-500 mt-2">
                        Please note that, for security reasons, we cannot
                        deliver to PO box addresses
                      </p>
                    </div>

                    <div class="mb-4">
                      <label class="block text-sm mb-2">City*</label>
                      <input
                        type="text"
                        required
                        class="w-full p-3 border border-gray-300 text-sm"
                        value={city()}
                        onInput={(e) => setCity(e.currentTarget.value)}
                      />
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label class="block text-sm mb-2">State*</label>
                        <div class="relative">
                          <select
                            required
                            class="w-full p-3 border border-gray-300 text-sm appearance-none bg-white"
                            value={state()}
                            onChange={(e) => setState(e.currentTarget.value)}
                          >
                            <option value="">Select State</option>
                            <option value="NY">New York</option>
                            {/* Add other states */}
                          </select>
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
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
                      <div>
                        <label class="block text-sm mb-2">
                          Postal or zip code*
                        </label>
                        <input
                          type="text"
                          required
                          class="w-full p-3 border border-gray-300 text-sm"
                          value={zipCode()}
                          onInput={(e) => setZipCode(e.currentTarget.value)}
                        />
                      </div>
                    </div>

                    <div class="mb-6">
                      <label class="block text-sm mb-2">Phone*</label>
                      <div class="flex gap-2">
                        <div class="w-24 relative">
                          <select
                            class="w-full p-3 border border-gray-300 text-sm appearance-none bg-white"
                            value={countryCode()}
                            onChange={(e) =>
                              setCountryCode(e.currentTarget.value)
                            }
                          >
                            <option value="+1">🇺🇸 +1</option>
                          </select>
                          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
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
                        <input
                          type="tel"
                          required
                          class="flex-1 p-3 border border-gray-300 text-sm"
                          value={phone()}
                          onInput={(e) => setPhone(e.currentTarget.value)}
                        />
                      </div>
                      <p class="text-xs text-gray-500 mt-2">
                        Just in case we need to contact you about your order
                      </p>
                    </div>

                    <div class="mb-8">
                      <label class="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={useBillingAddress()}
                          onChange={(e) =>
                            setUseBillingAddress(e.currentTarget.checked)
                          }
                        />
                        <span class="text-sm">Use as billing address</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      class="w-full bg-black text-white p-4 text-sm hover:opacity-90"
                    >
                      Confirm Delivery Address
                    </button>
                  </form>
                </div>
              </Show>
            </div>

            {/* Delivery Method Section */}
            <Show when={addressComplete()}>
              <div class="mb-8">
                <Show
                  when={!deliveryComplete()}
                  fallback={
                    <div class="flex items-start justify-between mb-8">
                      <div>
                        <div class="flex items-center gap-2 mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <h2 class="text-2xl font-light">Delivery Method</h2>
                        </div>
                        <div class="ml-7">
                          <div class="flex items-center gap-2">
                            <span class="bg-black text-white text-xs px-2 py-1">
                              Free Standard delivery
                            </span>
                            <img
                              src={items()[0].product.imageUrl}
                              alt="Product"
                              class="w-6 h-6 object-cover"
                            />
                            <span class="text-sm">
                              Arriving between May 6 - May 8
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleEditDelivery}
                        class="text-sm underline hover:opacity-70"
                      >
                        Edit
                      </button>
                    </div>
                  }
                >
                  <div>
                    <h2 class="text-2xl font-light mb-8">Delivery Method</h2>
                    <form onSubmit={handleDeliverySubmit}>
                      <div class="border border-gray-200 p-4 mb-6">
                        <div class="flex items-center gap-4">
                          <input
                            type="radio"
                            name="delivery"
                            value="standard"
                            checked
                          />
                          <div>
                            <p class="font-medium">Free Standard delivery</p>
                            <p class="text-sm text-gray-600">
                              Arriving between May 6 - May 8
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        class="w-full bg-black text-white p-4 text-sm hover:opacity-90"
                      >
                        Confirm Delivery Method
                      </button>
                    </form>
                  </div>
                </Show>
              </div>
            </Show>

            {/* Payment Section */}
            <Show when={deliveryComplete()}>
              <div>
                <h2 class="text-2xl font-light mb-8">Payment</h2>
                <p class="text-sm mb-6">Select your payment method</p>

                <div class="grid grid-cols-2 gap-4 mb-8">
                  <button
                    class={`border p-4 text-center transition-colors ${
                      selectedPayment() === "alipay"
                        ? "border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                    onClick={() => handlePaymentSelect("alipay")}
                  >
                    <img
                      src="/alipay-logo.png"
                      alt="Alipay"
                      class="h-8 mx-auto"
                    />
                  </button>
                  <button
                    class={`border p-4 text-center transition-colors ${
                      selectedPayment() === "paypal"
                        ? "border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                    onClick={() => handlePaymentSelect("paypal")}
                  >
                    <img
                      src="/paypal-logo.png"
                      alt="PayPal"
                      class="h-8 mx-auto"
                    />
                  </button>
                  <button
                    class={`border p-4 text-center transition-colors ${
                      selectedPayment() === "card"
                        ? "border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                    onClick={() => handlePaymentSelect("card")}
                  >
                    <span class="text-sm">Debit or credit card</span>
                  </button>
                  <button
                    class={`border p-4 text-center transition-colors ${
                      selectedPayment() === "afterpay"
                        ? "border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                    onClick={() => handlePaymentSelect("afterpay")}
                  >
                    <img
                      src="/afterpay-logo.png"
                      alt="Afterpay"
                      class="h-8 mx-auto"
                    />
                  </button>
                  <button
                    class={`border p-4 text-center transition-colors ${
                      selectedPayment() === "klarna"
                        ? "border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                    onClick={() => handlePaymentSelect("klarna")}
                  >
                    <img
                      src="/klarna-logo.png"
                      alt="Klarna"
                      class="h-8 mx-auto"
                    />
                  </button>
                  <button
                    class={`border p-4 text-center transition-colors ${
                      selectedPayment() === "crypto"
                        ? "border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                    onClick={() => handlePaymentSelect("crypto")}
                  >
                    <span class="text-sm">Cryptocurrency</span>
                  </button>
                  <button
                    class={`border p-4 text-center transition-colors ${
                      selectedPayment() === "zenobia"
                        ? "border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                    onClick={() => handlePaymentSelect("zenobia")}
                  >
                    <span class="text-sm">Zenobia Pay</span>
                  </button>
                </div>

                {paymentError() && (
                  <p class="text-red-600 text-sm mb-4">{paymentError()}</p>
                )}

                <button
                  class="w-full bg-black text-white p-4 text-sm hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleConfirmPaymentMethod}
                  disabled={!selectedPayment()}
                >
                  Confirm Payment Method
                </button>
              </div>
            </Show>
          </div>

          {/* Summary */}
          <div class="col-span-4">
            <div class="sticky top-8">
              <h2 class="text-xl mb-6">Summary</h2>
              <div class="mb-6">
                {items().map((item) => (
                  <div class="flex gap-4 mb-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      class="w-16 h-16 object-cover"
                    />
                    <div class="flex-1">
                      <p class="text-sm font-medium">{item.product.name}</p>
                      <p class="text-xs text-gray-500">64% Sale</p>
                      <div class="flex justify-between items-center mt-2">
                        <p class="text-xs line-through">
                          ${formatPrice(item.product.price + 35911)}
                        </p>
                        <p class="text-sm">-${formatPrice(35911)}</p>
                      </div>
                      <p class="text-sm text-right">
                        ${formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex justify-between">
                  <span class="text-sm">Delivery</span>
                  <span class="text-sm">Free</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm">Taxes</span>
                  <span class="text-sm">${formatPrice(1793)}</span>
                </div>
              </div>

              <div class="flex justify-between border-t border-black pt-4 mb-6">
                <span class="text-sm">Total</span>
                <div class="text-right">
                  <p class="text-sm">USD ${formatPrice(totalPrice())}</p>
                  <p class="text-xs text-gray-500">Import duties included</p>
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-sm mb-2">Promo code</label>
                <input
                  type="text"
                  placeholder="Enter promo code"
                  class="w-full p-3 border border-gray-300 text-sm"
                />
              </div>

              <div class="flex items-center justify-between text-sm mb-6">
                <span>30-day returns</span>
                <span class="bg-black text-white px-2 py-1 text-xs">Free</span>
              </div>

              <Show
                when={
                  paymentMethodConfirmed() && selectedPayment() === "zenobia"
                }
                fallback={
                  <button
                    class="w-full bg-gray-200 text-gray-500 p-4 text-sm cursor-not-allowed mb-4"
                    disabled
                  >
                    Place Order
                  </button>
                }
              >
                <ZenobiaPaymentButton
                  amount={totalPrice()}
                  url={`${window.location.origin}/create-transfer`}
                  statementItems={items().map((item) => ({
                    name:
                      item.product.name +
                      (item.color ? ` - ${item.color}` : "") +
                      (item.size ? ` - ${item.size}` : ""),
                    amount: item.product.price * item.quantity,
                  }))}
                  buttonText="Place Order"
                  buttonClass="w-full bg-black text-white p-4 text-sm hover:opacity-90 mb-4"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Show>

              <div class="text-xs text-gray-500">
                By placing your order, you agree to our{" "}
                <a href="/terms" class="underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" class="underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
