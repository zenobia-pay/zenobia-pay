import { Product } from "../types";

const products: Product[] = [
  {
    _id: "1",
    name: "Striped bowling shirt",
    brand: "Prada",
    slug: { _type: "slug", current: "striped-bowling-shirt" },
    description: "Striped bowling shirt in cotton twill. Made in Italy.",
    price: 172000,
    imageUrl:
      "https://cdn-images.farfetch-contents.com/29/56/96/34/29569634_58557936_1000.jpg",
    secondaryImageUrl:
      "https://cdn-images.farfetch-contents.com/29/56/96/34/29569634_58557924_1000.jpg",
    category: "shirts",
    colors: [],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    isNew: true,
  },
  {
    _id: "20",
    name: "RayBan Wayfarer",
    brand: "RayBan",
    slug: { _type: "slug", current: "rayban-wayfarer" },
    description: "RayBan Wayfarer in black. Made in Italy.",
    price: 1,
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41rNPPdCzqL._SLDPMOBCAROUSELAUTOCROP288221_MCnd_AC_SR462,693_.jpg",
    secondaryImageUrl:
      "https://www.finestresullarte.info/rivista/immagini/2023/2375/ray-ban-wayfarer-indossati.jpg",
    category: "accessories",
    colors: [],
    featured: true,
    isNew: true,
  },
  {
    _id: "2",
    name: "Cotton bucket hat",
    brand: "Prada",
    slug: { _type: "slug", current: "cotton-bucket-hat" },
    description: "Cotton bucket hat in cotton twill. Made in Italy.",
    price: 85000,
    imageUrl:
      "https://cdn-images.farfetch-contents.com/26/75/19/56/26751956_56378600_1000.jpg",
    secondaryImageUrl:
      "https://cdn-images.farfetch-contents.com/26/75/19/56/26751956_56378604_1000.jpg",
    category: "accessories",
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    isNew: false,
  },
  {
    _id: "3",
    name: "Belted trousers",
    brand: "Prada",
    slug: { _type: "slug", current: "belted-trousers" },
    description: "Belted trousers in cotton twill. Made in Italy.",
    price: 450000,
    imageUrl:
      "https://cdn-images.farfetch-contents.com/28/23/34/09/28233409_57652004_1000.jpg",
    secondaryImageUrl:
      "https://cdn-images.farfetch-contents.com/28/23/34/09/28233409_57651826_1000.jpg",
    category: "clothing",
    colors: [],
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    isNew: false,
  },
  {
    _id: "4",
    name: "Print Silk Shirt",
    brand: "Prada",
    slug: { _type: "slug", current: "print-silk-shirt" },
    description: "Oversized shirt in printed silk twill. Made in Italy.",
    price: 100000,
    imageUrl:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1525&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1525&q=80",
    category: "clothing",
    colors: [],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: false,
    isNew: false,
  },
  {
    _id: "5",
    name: "Shuffle mules",
    brand: "Prada",
    slug: { _type: "slug", current: "shuffle-mules" },
    description: "Shuffle mules in leather. Made in Italy.",
    price: 125000,
    imageUrl:
      "https://cdn-images.farfetch-contents.com/29/76/89/58/29768958_58856096_1000.jpg",
    secondaryImageUrl:
      "https://cdn-images.farfetch-contents.com/29/76/89/58/29768958_58855930_1000.jpg",
    category: "shoes",
    colors: [],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    featured: true,
    isNew: true,
  },
  {
    _id: "6",
    name: "Rhyton Leather Sneakers",
    slug: { _type: "slug", current: "rhyton-leather-sneakers" },
    description: "Chunky leather sneakers with vintage logo. Made in Italy.",
    price: 850,
    imageUrl:
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    category: "shoes",
    colors: ["white", "black", "beige"],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    featured: false,
    isNew: true,
  },
  {
    _id: "7",
    name: "Wool Mohair Tailored Jacket",
    slug: { _type: "slug", current: "wool-mohair-tailored-jacket" },
    description: "Single-breasted jacket in wool mohair blend. Made in Italy.",
    price: 2600,
    imageUrl:
      "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    category: "clothing",
    colors: ["black", "navy"],
    sizes: ["44", "46", "48", "50", "52", "54", "56"],
    featured: false,
    isNew: true,
  },
  {
    _id: "8",
    name: "Horsebit Leather Loafers",
    slug: { _type: "slug", current: "horsebit-leather-loafers" },
    description: "Black leather loafers with horsebit detail. Made in Italy.",
    price: 790,
    imageUrl:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    secondaryImageUrl:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    category: "shoes",
    colors: ["black", "brown"],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    featured: false,
    isNew: true,
  },
];

export const getProducts = (): Product[] => {
  return products;
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product._id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};
