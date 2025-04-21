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
  const [selectedColor, setSelectedColor] = createSignal<string | null>(null);
  const [selectedSize, setSelectedSize] = createSignal<string | null>(null);
  const [quantity, setQuantity] = createSignal(1);
  const [addingToCart, setAddingToCart] = createSignal(false);
  const navigate = useNavigate();

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  onMount(async () => {
    try {
      const productData = getProductById(params.id);
      setProduct(productData || null);

      // Set default color and size if available
      if (productData && productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }

      if (productData && productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
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
      addToCart(
        product()!,
        quantity(),
        selectedColor() || undefined,
        selectedSize() || undefined
      );
      // Navigate to cart after a short delay to show the success state
      setTimeout(() => {
        navigate("/cart");
      }, 500);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div class="container mx-auto px-4 py-8">
      <Show when={loading()}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-200 h-[600px] rounded"></div>
          <div>
            <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div class="mb-6">
              <div class="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="flex gap-2">
                {Array(4)
                  .fill(0)
                  .map(() => (
                    <div class="h-10 w-10 bg-gray-300 rounded"></div>
                  ))}
              </div>
            </div>
            <div class="mb-6">
              <div class="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="flex gap-2">
                {Array(4)
                  .fill(0)
                  .map(() => (
                    <div class="h-10 w-16 bg-gray-300 rounded"></div>
                  ))}
              </div>
            </div>
            <div class="mb-6">
              <div class="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-12 bg-gray-300 rounded w-24"></div>
            </div>
            <div class="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </Show>

      <Show when={error() || !product()}>
        <div class="text-center text-red-500 p-4">
          {error() || "Product not found"}
        </div>
        <div class="text-center mt-4">
          <A href="/products" class="text-black underline">
            Return to Products
          </A>
        </div>
      </Show>

      <Show when={!loading() && !error() && product()}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={product()!.imageUrl}
              alt={product()!.name}
              class="w-full h-auto object-cover"
            />
          </div>

          <div>
            <h1 class="text-3xl font-serif mb-2">{product()!.name}</h1>
            <p class="text-2xl mb-6">{formatPrice(product()!.price)}</p>

            {product()!.isNew && (
              <span class="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mb-4">
                New
              </span>
            )}

            <p class="text-gray-600 mb-6">{product()!.description}</p>

            {product()!.colors && product()!.colors.length > 0 && (
              <div class="mb-6">
                <h3 class="text-sm font-medium mb-2">Color</h3>
                <div class="flex flex-wrap gap-2">
                  {product()!.colors.map((color) => (
                    <button
                      class={`px-4 py-2 border ${
                        selectedColor() === color
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product()!.sizes && product()!.sizes.length > 0 && (
              <div class="mb-6">
                <h3 class="text-sm font-medium mb-2">Size</h3>
                <div class="flex flex-wrap gap-2">
                  {product()!.sizes.map((size) => (
                    <button
                      class={`px-4 py-2 border ${
                        selectedSize() === size
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div class="mb-6">
              <h3 class="text-sm font-medium mb-2">Quantity</h3>
              <div class="flex items-center border border-gray-300 w-32">
                <button
                  class="px-3 py-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity(Math.max(1, quantity() - 1))}
                >
                  -
                </button>
                <span class="flex-grow text-center">{quantity()}</span>
                <button
                  class="px-3 py-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setQuantity(quantity() + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              class="w-full bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={addingToCart()}
            >
              {addingToCart() ? (
                <span class="flex items-center justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding to Cart...
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>

            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-sm font-medium mb-2">Product Details</h3>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>Category: {product()!.category}</li>
                <li>SKU: {product()!._id}</li>
              </ul>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ProductDetailPage;
