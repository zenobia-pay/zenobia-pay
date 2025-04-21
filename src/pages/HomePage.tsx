import { Component } from "solid-js";
import { A } from "@solidjs/router";
import FeaturedProducts from "../components/products/FeaturedProducts";

const HomePage: Component = () => {
  return (
    <div>
      {/* Hero Banner */}
      <section class="relative h-screen bg-gray-100">
        <div
          class="absolute inset-0 bg-cover bg-center"
          style="background-image: url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');"
        >
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center text-center p-4">
          <div class="max-w-2xl">
            <h1 class="text-white text-4xl md:text-6xl font-serif mb-6">
              SUMMER COLLECTION 2025
            </h1>
            <p class="text-white text-lg md:text-xl mb-8">
              Discover the latest trends in luxury fashion
            </p>
            <A
              href="/products"
              class="inline-block bg-white text-black px-8 py-3 text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition duration-300"
            >
              Shop Now
            </A>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section class="py-16 px-4 bg-gray-50">
        <div class="container mx-auto">
          <h2 class="text-3xl font-serif mb-12 text-center">
            Featured Products
          </h2>
          <FeaturedProducts />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
