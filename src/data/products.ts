import { Product } from "../types";

const products: Product[] = [
  {
    id: "1",
    name: "Ace Leather Sneakers",
    description:
      "White leather low-top sneakers with signature green and red Web stripe and gold bee embroidery.",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    category: "shoes",
    colors: ["white", "black"],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    featured: true,
  },
  {
    id: "2",
    name: "Interlocking G Leather Belt",
    description: "Black leather belt with gold double G buckle. Made in Italy.",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1497&q=80",
    category: "accessories",
    colors: ["black", "brown"],
    sizes: ["85cm", "90cm", "95cm", "100cm", "105cm"],
    featured: true,
  },
  {
    id: "3",
    name: "GG Marmont Shoulder Bag",
    description:
      "Matelassé leather shoulder bag with double G hardware. Made in Italy.",
    price: 2300,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80",
    category: "accessories",
    colors: ["black", "red", "beige"],
    featured: true,
  },
  {
    id: "4",
    name: "Print Silk Shirt",
    description: "Oversized shirt in printed silk twill. Made in Italy.",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1525&q=80",
    category: "clothing",
    colors: ["multicolor"],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: "5",
    name: "Web Stripe Wool Scarf",
    description: "Wool scarf with signature Web stripe. Made in Italy.",
    price: 420,
    image:
      "https://images.unsplash.com/photo-1520903920243-40285a2bccf3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
    category: "accessories",
    colors: ["navy/red", "green/red"],
    new: true,
  },
  {
    id: "6",
    name: "Rhyton Leather Sneakers",
    description: "Chunky leather sneakers with vintage logo. Made in Italy.",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    category: "shoes",
    colors: ["white", "black", "beige"],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    new: true,
  },
  {
    id: "7",
    name: "Wool Mohair Tailored Jacket",
    description: "Single-breasted jacket in wool mohair blend. Made in Italy.",
    price: 2600,
    image:
      "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    category: "clothing",
    colors: ["black", "navy"],
    sizes: ["44", "46", "48", "50", "52", "54", "56"],
    new: true,
  },
  {
    id: "8",
    name: "Horsebit Leather Loafers",
    description: "Black leather loafers with horsebit detail. Made in Italy.",
    price: 790,
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    category: "shoes",
    colors: ["black", "brown"],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    new: true,
  },
];

export const getProducts = (): Product[] => {
  return products;
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category);
};
