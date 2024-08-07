// useCart.ts
import { useState } from "react";
import type { CartItemType, Coupon, Product } from "types";
import { calculateCartTotal, updateCartItemQuantity } from "hooks/utils/cartUtils";

export const useCart = () => {
  const [cartList, setCartList] = useState<CartItemType[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    setCartList((prevCartList) => {
      const isItem = prevCartList.find(
        (item) => item.product.id === product.id,
      );
      if (isItem) {
        return prevCartList.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }
      return [...prevCartList, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartList((prevCartList) => {
      return prevCartList.filter(
        (cartItem) => cartItem.product.id !== productId,
      );
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartList((prevCartList) => {
      return updateCartItemQuantity(prevCartList, productId, newQuantity);
    });
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateCartTotal(cartList, selectedCoupon);

  const calculateTotal = () => ({
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
  });

  return {
    cartList,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
