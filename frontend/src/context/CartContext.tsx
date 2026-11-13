
import {
  createContext,
  useContext,
  useEffect,
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

const CART_STORAGE_KEY = "eneba_assignment_cart_v1";

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

// Validate saved cart items before restoring them.
function isValidCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.offerId === "string" &&
    item.offerId.length > 0 &&
    typeof item.productId === "string" &&
    item.productId.length > 0 &&
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    typeof item.imageUrl === "string" &&
    typeof item.platform === "string" &&
    typeof item.region === "string" &&
    typeof item.seller === "string" &&
    typeof item.currency === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    item.quantity === 1
  );
}

// Load cart once when CartProvider is initialized.
function loadSavedCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(
      CART_STORAGE_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Remove invalid entries and duplicate offer IDs.
    const seenOfferIds = new Set<string>();

    return parsed.filter((item): item is CartItem => {
      if (!isValidCartItem(item)) {
        return false;
      }

      if (seenOfferIds.has(item.offerId)) {
        return false;
      }

      seenOfferIds.add(item.offerId);
      return true;
    });
  } catch {
    // Invalid JSON or storage unavailable.
    return [];
  }
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Lazy initialization avoids reading storage on every render.
  const [items, setItems] = useState<CartItem[]>(
    loadSavedCart
  );

  // Save whenever the cart changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch {
      // Storage may be blocked or full.
      // Cart still works in React state.
    }
  }, [items]);

  const addItem = (
    item: Omit<CartItem, "quantity">
  ) => {
    setItems((current) => {
      // One cart line per seller offer.
      if (
        current.some(
          (entry) => entry.offerId === item.offerId
        )
      ) {
        return current;
      }

      return [
        ...current,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = (offerId: string) => {
    setItems((current) =>
      current.filter(
        (item) => item.offerId !== offerId
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  // Display-only subtotal.
  // The backend must recalculate prices at checkout.
  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.price * item.quantity,
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
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
