"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { calculateGratitudeReward } from "@/lib/storefront";
import { addCartLines, createCart, getCart, removeCartLines, updateCartLines } from "@/lib/shopify";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    const storedCartId = window.localStorage.getItem("nord-thread-cart-id");
    const markReady = () => {
      if (isActive) {
        setIsReady(true);
      }
    };

    if (!storedCartId) {
      queueMicrotask(markReady);
      return () => {
        isActive = false;
      };
    }

    getCart(storedCartId)
      .then((shopifyCart) => {
        if (shopifyCart) {
          setCart(shopifyCart);
        } else {
          window.localStorage.removeItem("nord-thread-cart-id");
        }
      })
      .catch(() => {
        window.localStorage.removeItem("nord-thread-cart-id");
      })
      .finally(markReady);

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !cart?.id) {
      return;
    }

    window.localStorage.setItem("nord-thread-cart-id", cart.id);
  }, [cart?.id, isReady]);

  async function addItem(product, selection) {
    setIsUpdating(true);
    setError("");

    try {
      const merchandiseId = selection.variantId;
      const line = { merchandiseId, quantity: 1 };
      const nextCart = cart?.id
        ? await addCartLines(cart.id, [line])
        : await createCart([line]);

      if (!nextCart) {
        throw new Error("Unable to create Shopify cart. Check Storefront API configuration.");
      }

      setCart(nextCart);
      setIsDrawerOpen(true);
    } catch (cartError) {
      setError(cartError.message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeItem(lineId) {
    if (!cart?.id) {
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      setCart(await removeCartLines(cart.id, [lineId]));
    } catch (cartError) {
      setError(cartError.message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function updateQuantity(lineId, quantity) {
    if (!cart?.id) {
      return;
    }

    if (quantity <= 0) {
      await removeItem(lineId);
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      setCart(await updateCartLines(cart.id, [{ id: lineId, quantity }]));
    } catch (cartError) {
      setError(cartError.message);
    } finally {
      setIsUpdating(false);
    }
  }

  function checkout() {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }

  const items = cart?.items ?? [];
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart?.subtotal ?? 0;
  const reward = calculateGratitudeReward(itemCount);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        subtotal,
        reward,
        checkoutUrl: cart?.checkoutUrl ?? "",
        isDrawerOpen,
        isReady,
        isUpdating,
        error,
        setIsDrawerOpen,
        addItem,
        removeItem,
        updateQuantity,
        checkout
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
