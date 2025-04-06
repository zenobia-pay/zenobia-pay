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
              SUMMER COLLECTION 2023
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

      {/* Categories */}
      <section class="py-16 px-4">
        <div class="container mx-auto">
          <h2 class="text-3xl font-serif mb-12 text-center">
            Shop by Category
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="relative group overflow-hidden">
              <div class="aspect-w-3 aspect-h-4">
                <img
                  src="https://images.unsplash.com/photo-1591369822096-ffd140ec948f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Clothing"
                  class="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <A
                  href="/products"
                  class="bg-white bg-opacity-90 px-8 py-3 text-black text-center text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition duration-300"
                >
                  Clothing
                </A>
              </div>
            </div>
            <div class="relative group overflow-hidden">
              <div class="aspect-w-3 aspect-h-4">
                <img
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
                  alt="Shoes"
                  class="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <A
                  href="/products"
                  class="bg-white bg-opacity-90 px-8 py-3 text-black text-center text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition duration-300"
                >
                  Shoes
                </A>
              </div>
            </div>
            <div class="relative group overflow-hidden">
              <div class="aspect-w-3 aspect-h-4">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80"
                  alt="Accessories"
                  class="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <A
                  href="/products"
                  class="bg-white bg-opacity-90 px-8 py-3 text-black text-center text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition duration-300"
                >
                  Accessories
                </A>
              </div>
            </div>
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

      {/* Newsletter */}
      <section class="py-16 px-4">
        <div class="container mx-auto max-w-4xl text-center">
          <h2 class="text-3xl font-serif mb-6">Join Our Newsletter</h2>
          <p class="text-gray-600 mb-8">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form class="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              class="flex-grow border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
              required
            />
            <button
              type="submit"
              class="bg-black text-white px-8 py-3 text-sm uppercase tracking-wider font-medium hover:bg-gray-800"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
