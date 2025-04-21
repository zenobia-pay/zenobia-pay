import {
  Component,
  createContext,
  useContext,
  createSignal,
  JSX,
} from "solid-js";
import { Product } from "../types";

interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextType {
  items: () => CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const CartContext = createContext<CartContextType>();

// Default product for testing
const defaultProduct: Product = {
  _id: "default-product",
  slug: {
    _type: "slug",
    current: "classic-t-shirt",
  },
  name: "Classic T-Shirt",
  description: "A comfortable and stylish t-shirt for everyday wear.",
  price: 2999, // $29.99 in cents
  imageUrl:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  category: "clothing",
  colors: ["Black", "White", "Navy"],
  sizes: ["S", "M", "L", "XL"],
  featured: true,
  isNew: true,
};

export const CartProvider: Component<{ children: JSX.Element }> = (props) => {
  // Initialize with default items
  const [items, setItems] = createSignal<CartItem[]>([
    {
      product: defaultProduct,
      quantity: 2,
      color: "Black",
      size: "M",
    },
  ]);

  const addToCart = (
    product: Product,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.product._id === product._id &&
          item.color === color &&
          item.size === size
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product._id === product._id &&
          item.color === color &&
          item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { product, quantity, color, size }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    // Instead of clearing, reinitialize with default items
    setItems([
      {
        product: defaultProduct,
        quantity: 2,
        color: "Black",
        size: "M",
      },
    ]);
  };

  const totalItems = () => {
    return items().reduce((total, item) => total + item.quantity, 0);
  };

  const totalPrice = () => {
    return items().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
