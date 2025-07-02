import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Create a Sanity client
export const client = createClient({
  projectId: "bxcaar4l", // Replace with your actual Sanity project ID
  dataset: "production",
  apiVersion: "2025-04-20", // Use the current date in YYYY-MM-DD format
  useCdn: true, // Set to false if you want to ensure fresh data
});

// Create an image builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export function urlFor(source: any) {
  return builder.image(source);
}

// Product queries
export async function getProducts() {
  return client.fetch(`
    *[_type == "product"] {
      _id,
      name,
      slug,
      description,
      price,
      "imageUrl": image.asset->url,
      category,
      colors,
      sizes,
      featured,
      "isNew": _createdAt > now() - 7*24*60*60
    }
  `);
}

export async function getProductById(id: string) {
  return client.fetch(
    `
    *[_type == "product" && _id == $id][0] {
      _id,
      name,
      slug,
      description,
      price,
      "imageUrl": image.asset->url,
      category,
      colors,
      sizes,
      featured,
      "isNew": _createdAt > now() - 7*24*60*60
    }
  `,
    { id }
  );
}

export async function getProductsByCategory(category: string) {
  return client.fetch(
    `
    *[_type == "product" && category == $category] {
      _id,
      name,
      slug,
      description,
      price,
      "imageUrl": image.asset->url,
      category,
      colors,
      sizes,
      featured,
      "isNew": _createdAt > now() - 7*24*60*60
    }
  `,
    { category }
  );
}

export async function getFeaturedProducts() {
  return client.fetch(`
    *[_type == "product" && featured == true][0...4] {
      _id,
      name,
      slug,
      description,
      price,
      "imageUrl": image.asset->url,
      category,
      colors,
      sizes,
      featured,
      "isNew": _createdAt > now() - 7*24*60*60
    }
  `);
}
