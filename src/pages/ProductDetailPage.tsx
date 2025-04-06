import { Component, createSignal, createEffect, Show } from "solid-js";
import { useParams, A } from "@solidjs/router";
import { getProductById } from "../data/products";
import { Product } from "../types";

const ProductDetailPage: Component = () => {
  const params = useParams();
  const [product, setProduct] = createSignal<Product | undefined>(undefined);
  const [selectedColor, setSelectedColor] = createSignal<string | null>(null);
  const [selectedSize, setSelectedSize] = createSignal<string | null>(null);
  const [quantity, setQuantity] = createSignal(1);
  const [isLoading, setIsLoading] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal<
    "details" | "shipping" | "returns"
  >("details");

  createEffect(() => {
    setIsLoading(true);
    const id = params.id;
    const fetchedProduct = getProductById(id);
    setProduct(fetchedProduct);

    if (fetchedProduct) {
      // Set default selections
      if (fetchedProduct.colors?.length > 0) {
        setSelectedColor(fetchedProduct.colors[0]);
      }

      if (fetchedProduct.sizes?.length > 0) {
        setSelectedSize(fetchedProduct.sizes[0]);
      }
    }

    setIsLoading(false);
  });

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product: product(),
      quantity: quantity(),
      color: selectedColor(),
      size: selectedSize(),
    });
    // Here you would normally dispatch to a cart store
  };

  return (
    <div>
      {isLoading() ? (
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : (
        <Show
          when={product()}
          fallback={<div class="text-center py-12">Product not found</div>}
        >
          <div>
            {/* Breadcrumb navigation */}
            <div class="border-b border-gray-200 py-4">
              <div class="container mx-auto px-4">
                <div class="flex items-center text-sm">
                  <A href="/" class="text-gray-600 hover:text-black">
                    {product()!.category.charAt(0).toUpperCase() +
                      product()!.category.slice(1)}
                  </A>
                  <span class="mx-2">/</span>
                  <span class="font-medium">{product()!.name}</span>
                </div>
              </div>
            </div>

            {/* Product display */}
            <div class="container mx-auto px-4 py-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Product Images */}
                <div>
                  <div class="relative">
                    <img
                      src={product()!.image}
                      alt={product()!.name}
                      class="w-full h-auto"
                    />
                    <button
                      class="absolute top-2 right-2 p-2"
                      aria-label="Add to Wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h1 class="text-2xl uppercase font-medium mb-1">
                    {product()!.name}
                  </h1>
                  <p class="text-xl mb-6">${product()!.price.toFixed(2)}</p>

                  <div class="border-t border-gray-200 pt-6 mb-6">
                    <p class="text-gray-700 mb-6">{product()!.description}</p>
                  </div>

                  {product()!.colors && product()!.colors.length > 0 && (
                    <div class="mb-6">
                      <h3 class="text-sm font-medium mb-3 uppercase">
                        Color:{" "}
                        <span class="font-normal">{selectedColor()}</span>
                      </h3>
                      <div class="flex space-x-3">
                        {product()!.colors.map((color) => (
                          <button
                            class={`w-10 h-10 rounded-full ${
                              selectedColor() === color
                                ? "ring-2 ring-offset-2 ring-black"
                                : ""
                            }`}
                            style={{
                              "background-color": color.includes("/")
                                ? "#ccc"
                                : color,
                            }}
                            onClick={() => setSelectedColor(color)}
                            aria-label={`Color: ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {product()!.sizes && product()!.sizes.length > 0 && (
                    <div class="mb-6">
                      <h3 class="text-sm font-medium mb-3 uppercase">
                        Size: <span class="font-normal">{selectedSize()}</span>
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        {product()!.sizes.map((size) => (
                          <button
                            class={`min-w-[3rem] h-10 px-3 border ${
                              selectedSize() === size
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-black"
                            }`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div class="mb-8">
                    <h3 class="text-sm font-medium mb-3 uppercase">Quantity</h3>
                    <div class="flex items-center border border-gray-300 w-32">
                      <button
                        class="px-4 py-2 text-xl"
                        onClick={handleDecreaseQuantity}
                        disabled={quantity() <= 1}
                      >
                        -
                      </button>
                      <span class="px-4 py-2 flex-grow text-center">
                        {quantity()}
                      </span>
                      <button
                        class="px-4 py-2 text-xl"
                        onClick={handleIncreaseQuantity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    class="bg-black text-white py-4 uppercase text-sm tracking-wider w-full mb-6 hover:bg-gray-800"
                    onClick={handleAddToCart}
                  >
                    Add to Shopping Bag
                  </button>

                  {/* Product tabs */}
                  <div class="border-t border-gray-200 pt-6">
                    <div class="flex border-b border-gray-200">
                      <button
                        class={`py-3 px-4 text-sm uppercase ${
                          activeTab() === "details"
                            ? "border-b-2 border-black font-medium"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("details")}
                      >
                        Details
                      </button>
                      <button
                        class={`py-3 px-4 text-sm uppercase ${
                          activeTab() === "shipping"
                            ? "border-b-2 border-black font-medium"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("shipping")}
                      >
                        Shipping
                      </button>
                      <button
                        class={`py-3 px-4 text-sm uppercase ${
                          activeTab() === "returns"
                            ? "border-b-2 border-black font-medium"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("returns")}
                      >
                        Returns
                      </button>
                    </div>

                    <div class="py-4">
                      <Show when={activeTab() === "details"}>
                        <p class="text-sm leading-relaxed">
                          {product()!.description} Made in Italy. Comes with
                          dustbag and authenticity card.
                        </p>
                        <ul class="mt-4 text-sm list-disc pl-5 space-y-1">
                          <li>Premium quality materials</li>
                          <li>Product code: {product()!.id}0123</li>
                          <li>Care: Wipe with a soft cloth</li>
                        </ul>
                      </Show>

                      <Show when={activeTab() === "shipping"}>
                        <p class="text-sm leading-relaxed">
                          Free standard shipping on all orders. Express delivery
                          available.
                        </p>
                        <ul class="mt-4 text-sm list-disc pl-5 space-y-1">
                          <li>Standard delivery: 3-5 business days</li>
                          <li>Express delivery: 1-2 business days</li>
                          <li>Same-day delivery available in select cities</li>
                        </ul>
                      </Show>

                      <Show when={activeTab() === "returns"}>
                        <p class="text-sm leading-relaxed">
                          Free returns within 30 days of delivery. Items must be
                          unworn and in original packaging.
                        </p>
                        <ul class="mt-4 text-sm list-disc pl-5 space-y-1">
                          <li>Return label included with every order</li>
                          <li>Exchanges available</li>
                          <li>Contact customer service for assistance</li>
                        </ul>
                      </Show>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>
      )}
    </div>
  );
};

export default ProductDetailPage;
