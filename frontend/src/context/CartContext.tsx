
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  offerId: string;
  productId: string;
  slug: string;
  title: string;
  imageUrl: string;
  platform: string;
  region: string;
  seller: string;
  price: number;
  currency: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (offerId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      // Digital key: one cart line per offer.
      if (current.some((entry) => entry.offerId === item.offerId)) {
        return current;
      }

      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (offerId: string) => {
    setItems((current) =>
      current.filter((item) => item.offerId !== offerId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Display-only subtotal. Backend must recalculate checkout.
  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
