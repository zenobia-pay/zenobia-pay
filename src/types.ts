export interface Product {
  _id: string;
  name: string;
  slug: {
    _type: string;
    current: string;
  };
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
