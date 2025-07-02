import { Component, createSignal, onMount } from "solid-js";
import { useParams, A, useNavigate } from "@solidjs/router";
import { getProductById } from "../data/products";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { Show } from "solid-js";

const ProductDetailPage: Component = () => {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = createSignal<Product | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedSize, setSelectedSize] = createSignal<string | null>(null);
  const [sizeDropdownOpen, setSizeDropdownOpen] = createSignal(false);
  const [addingToCart, setAddingToCart] = createSignal(false);
  const navigate = useNavigate();

  onMount(async () => {
    try {
      const productData = getProductById(params.id);
      setProduct(productData || null);
    } catch (err) {
      setError("Failed to load product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  const handleAddToCart = async () => {
    if (!product()) return;

    setAddingToCart(true);
    try {
      addToCart(product()!, 1, undefined, selectedSize() || undefined);
      setTimeout(() => {
        navigate("/cart");
      }, 500);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = () => {
    // Implement wishlist functionality
  };

  return (
    <div class="max-w-[1920px] mx-auto">
      <Show when={loading()}>
        <div class="grid grid-cols-2 gap-8 px-12 py-8">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-100 h-[600px]" />
            <div class="bg-gray-100 h-[600px]" />
          </div>
          <div class="py-8">
            <div class="h-8 bg-gray-100 w-3/4 mb-4" />
            <div class="h-6 bg-gray-100 w-1/4 mb-8" />
            <div class="h-12 bg-gray-100 w-full mb-8" />
            <div class="space-y-2">
              {Array(4)
                .fill(0)
                .map(() => (
                  <div class="h-12 bg-gray-100 w-full" />
                ))}
            </div>
          </div>
        </div>
      </Show>

      <Show when={error()}>
        <div class="text-center py-12">
          <p class="text-red-600 mb-4">{error()}</p>
          <A href="/products" class="text-black underline hover:text-gray-600">
            Return to Products
          </A>
        </div>
      </Show>

      <Show when={!loading() && !error() && product()}>
        <div class="grid grid-cols-2 gap-8 px-12 py-8">
          {/* Left Column - Images */}
          <div class="grid grid-cols-2 gap-4">
            <img
              src={product()!.imageUrl}
              alt={`${product()!.name} - View 1`}
              class="w-full aspect-square object-contain bg-[#f8f8f8]"
            />
            <img
              src={product()!.secondaryImageUrl}
              alt={`${product()!.name} - View 2`}
              class="w-full aspect-square object-contain bg-[#f8f8f8]"
            />
          </div>

          {/* Right Column - Product Info */}
          <div class="py-8 max-w-[480px]">
            <h1 class="text-xl font-light mb-1">{product()!.name}</h1>
            <p class="text-base mb-4">{product()!.description}</p>

            <p class="text-xl mb-8">${product()!.price / 100}</p>

            <div class="mb-8">
              <div class="relative">
                <button
                  class="w-full py-3 px-4 border border-gray-300 text-left text-sm flex justify-between items-center hover:border-black"
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen())}
                >
                  <span>{selectedSize() || "Select size"}</span>
                  <svg
                    class={`w-5 h-5 transition-transform ${
                      sizeDropdownOpen() ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <Show when={sizeDropdownOpen()}>
                  <div class="absolute top-full left-0 right-0 bg-white border border-gray-300 mt-1 z-10">
                    {product()!.sizes?.map((size) => (
                      <button
                        class="w-full py-3 px-4 text-left text-sm hover:bg-gray-50"
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeDropdownOpen(false);
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </Show>
              </div>
            </div>

            <div class="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart() || !selectedSize()}
                class="w-full bg-black text-white py-4 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {addingToCart() ? "Adding to Bag..." : "Add To Bag"}
              </button>
              <button
                onClick={handleAddToWishlist}
                class="w-full border border-black py-4 text-sm hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>Wishlist</span>
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            <div class="mt-8">
              <p class="text-sm mb-2">Estimated delivery</p>
              <p class="text-sm text-gray-600">May 7 - May 9</p>
            </div>

            <div class="mt-4 p-4 bg-[#f8f8f8]">
              <p class="text-sm">
                Free shipping on orders over $200 | Plus free returns for 30
                days
              </p>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ProductDetailPage;
