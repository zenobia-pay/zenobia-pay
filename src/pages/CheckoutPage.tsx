import { Component, createSignal, Show } from "solid-js";
import { useCart } from "../context/CartContext";
import { A, useNavigate } from "@solidjs/router";
import { ZenobiaPaymentButton } from "@zenobia/ui-solid";

type CheckoutStep = "address" | "delivery" | "payment";

const CheckoutPage: Component = () => {
  const { items, totalPrice, clearCart } = useCart();
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
  const [paymentSuccess, setPaymentSuccess] = createSignal(false);
  const navigate = useNavigate();

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const calculateTax = () => {
    return Math.round(totalPrice() * 0.0825); // 8.25% tax rate
  };

  const calculateTotal = () => {
    return totalPrice() + calculateTax();
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
    setPaymentSuccess(true);
    clearCart();
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

  return (
    <Show
      when={paymentSuccess()}
      fallback={
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
                NOT FARFETCH
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
                            <h2 class="text-2xl font-light">
                              Delivery Address
                            </h2>
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
                        <p class="text-xs text-gray-500 mb-4">
                          *Required fields
                        </p>

                        <div class="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label class="block text-sm mb-2">
                              First name*
                            </label>
                            <input
                              type="text"
                              required
                              class="w-full p-3 border border-gray-300 text-sm"
                              value={firstName()}
                              onInput={(e) =>
                                setFirstName(e.currentTarget.value)
                              }
                            />
                          </div>
                          <div>
                            <label class="block text-sm mb-2">Last name*</label>
                            <input
                              type="text"
                              required
                              class="w-full p-3 border border-gray-300 text-sm"
                              value={lastName()}
                              onInput={(e) =>
                                setLastName(e.currentTarget.value)
                              }
                            />
                          </div>
                        </div>

                        <div class="mb-4">
                          <label class="block text-sm mb-2">
                            Country/region*
                          </label>
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
                                onChange={(e) =>
                                  setState(e.currentTarget.value)
                                }
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
                              <h2 class="text-2xl font-light">
                                Delivery Method
                              </h2>
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
                        <h2 class="text-2xl font-light mb-8">
                          Delivery Method
                        </h2>
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
                                <p class="font-medium">
                                  Free Standard delivery
                                </p>
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
                  <div class="mb-8">
                    <Show
                      when={!paymentMethodConfirmed()}
                      fallback={
                        <div class="flex items-start justify-between">
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
                              <h2 class="text-2xl font-light">Payment</h2>
                            </div>
                            <div class="ml-7">
                              <div class="flex items-center gap-2">
                                <img
                                  src={
                                    selectedPayment() === "zenobia"
                                      ? "/zenobia-logo.png"
                                      : selectedPayment() === "alipay"
                                      ? "https://upload.wikimedia.org/wikipedia/en/c/c7/Alipay_logo_%282020%29.svg"
                                      : selectedPayment() === "paypal"
                                      ? "https://1000logos.net/wp-content/uploads/2017/05/Paypal-Logo-2022.png"
                                      : selectedPayment() === "afterpay"
                                      ? "https://1000logos.net/wp-content/uploads/2023/03/AfterPay-logo.png"
                                      : selectedPayment() === "klarna"
                                      ? "https://1000logos.net/wp-content/uploads/2022/07/Klarna-Logo.png"
                                      : undefined
                                  }
                                  alt={selectedPayment()}
                                  class="h-6"
                                />
                                <span class="text-sm capitalize">
                                  {selectedPayment()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setPaymentMethodConfirmed(false)}
                            class="text-sm underline hover:opacity-70"
                          >
                            Edit
                          </button>
                        </div>
                      }
                    >
                      <div>
                        <h2 class="text-2xl font-light mb-8">Payment</h2>
                        <p class="text-sm mb-6">Select your payment method</p>

                        <div class="grid grid-cols-3 gap-4 mb-8">
                          <button
                            class={`border p-6 flex flex-col items-center justify-center gap-2 transition-colors ${
                              selectedPayment() === "alipay"
                                ? "border-black"
                                : "border-gray-200 hover:border-black"
                            }`}
                            onClick={() => handlePaymentSelect("alipay")}
                          >
                            <img
                              src="https://upload.wikimedia.org/wikipedia/en/c/c7/Alipay_logo_%282020%29.svg"
                              alt="Alipay"
                              class="h-8"
                            />
                          </button>
                          <button
                            class={`border p-6 flex flex-col items-center justify-center gap-2 transition-colors ${
                              selectedPayment() === "paypal"
                                ? "border-black"
                                : "border-gray-200 hover:border-black"
                            }`}
                            onClick={() => handlePaymentSelect("paypal")}
                          >
                            <img
                              src="https://1000logos.net/wp-content/uploads/2017/05/Paypal-Logo-2022.png"
                              alt="PayPal"
                              class="h-8"
                            />
                          </button>
                          <button
                            class={`border p-6 flex flex-col items-center justify-center gap-2 transition-colors ${
                              selectedPayment() === "card"
                                ? "border-black"
                                : "border-gray-200 hover:border-black"
                            }`}
                            onClick={() => handlePaymentSelect("card")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                            <span class="text-sm">Credit or debit card</span>
                          </button>
                          <button
                            class={`border p-6 flex flex-col items-center justify-center gap-2 transition-colors ${
                              selectedPayment() === "afterpay"
                                ? "border-black"
                                : "border-gray-200 hover:border-black"
                            }`}
                            onClick={() => handlePaymentSelect("afterpay")}
                          >
                            <img
                              src="https://1000logos.net/wp-content/uploads/2023/03/AfterPay-logo.png"
                              alt="Afterpay"
                              class="h-8"
                            />
                          </button>
                          <button
                            class={`border p-6 flex flex-col items-center justify-center gap-2 transition-colors ${
                              selectedPayment() === "klarna"
                                ? "border-black"
                                : "border-gray-200 hover:border-black"
                            }`}
                            onClick={() => handlePaymentSelect("klarna")}
                          >
                            <img
                              src="https://1000logos.net/wp-content/uploads/2022/07/Klarna-Logo.png"
                              alt="Klarna"
                              class="h-8"
                            />
                          </button>
                          <button
                            class={`border p-6 flex flex-col items-center justify-center gap-2 transition-colors ${
                              selectedPayment() === "zenobia"
                                ? "border-black"
                                : "border-gray-200 hover:border-black"
                            }`}
                            onClick={() => handlePaymentSelect("zenobia")}
                          >
                            <img
                              src="/zenobia-logo.png"
                              alt="Zenobia Pay"
                              class="h-8"
                            />
                            <span class="text-sm">Zenobia Pay</span>
                          </button>
                        </div>

                        {paymentError() && (
                          <p class="text-red-600 text-sm mb-4">
                            {paymentError()}
                          </p>
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
                </Show>
              </div>

              {/* Summary */}
              <div class="col-span-4">
                <div class="sticky top-8">
                  <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl">Total</h2>
                    <span class="text-xl">
                      USD ${formatPrice(calculateTotal())}
                    </span>
                  </div>

                  <div class="h-[52px] mb-8">
                    <Show
                      when={
                        paymentMethodConfirmed() &&
                        selectedPayment() === "zenobia"
                      }
                      fallback={
                        <button
                          class="w-full bg-gray-200 text-gray-500 p-4 text-sm cursor-not-allowed"
                          disabled
                        >
                          Place Order
                        </button>
                      }
                    >
                      <ZenobiaPaymentButton
                        amount={calculateTotal()}
                        url={`${window.location.origin}/create-transfer`}
                        statementItems={items().map((item) => ({
                          name:
                            item.product.name +
                            (item.color ? ` - ${item.color}` : "") +
                            (item.size ? ` - ${item.size}` : ""),
                          amount: item.product.price * item.quantity,
                        }))}
                        buttonText="Pay with Zenobia"
                        buttonClass="w-full bg-black text-white p-4 text-sm hover:opacity-90"
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </Show>
                  </div>

                  <div class="text-xs text-gray-500 mb-8">
                    By placing your order, you agree to our{" "}
                    <a href="/terms" class="underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" class="underline">
                      Privacy Policy
                    </a>
                  </div>

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
                          <p class="text-sm text-right">
                            ${formatPrice(item.product.price * item.quantity)}
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
                      <span class="text-sm">
                        ${formatPrice(calculateTax())}
                      </span>
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

                  <div class="flex items-center justify-between text-sm">
                    <span>30-day returns</span>
                    <span class="bg-black text-white px-2 py-1 text-xs">
                      Free
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div class="min-h-screen bg-white">
        <div class="max-w-[1920px] mx-auto px-12 py-16">
          <div class="max-w-3xl mx-auto">
            <div class="text-center mb-12">
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
              <h1 class="text-3xl font-light mb-4">
                Congratulations on your purchase!
              </h1>
              <p class="text-gray-600">
                We'll send you an email confirmation with tracking details
                shortly.
              </p>
            </div>

            <div class="bg-[#f8f8f8] p-8 mb-8">
              <h2 class="text-xl mb-6">Order Summary</h2>
              <div class="space-y-6">
                {items().map((item) => (
                  <div class="flex gap-6">
                    <div class="w-24">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        class="w-full aspect-square object-cover"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="font-medium mb-1">{item.product.name}</p>
                      {item.size && (
                        <p class="text-sm text-gray-600 mb-1">
                          Size: {item.size}
                        </p>
                      )}
                      <p class="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-medium">
                        ${formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div class="border-t border-gray-300 mt-8 pt-6">
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Subtotal</span>
                  <span>${formatPrice(totalPrice())}</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">Tax</span>
                  <span>${formatPrice(calculateTax())}</span>
                </div>
                <div class="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>

            <div class="text-center">
              <A
                href="/"
                class="inline-block bg-black text-white px-8 py-3 text-sm hover:opacity-90"
              >
                Continue Shopping
              </A>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default CheckoutPage;
