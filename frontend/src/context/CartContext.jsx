import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(UserContext);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/cart`,
        { withCredentials: true }
      );
      setCartItems(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setCartItems([]);
      } else {
        console.error(error);
      }
    }
  };

  const addcart = async (productId, quantity = 1) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/addtocart`,
        { productId, quantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removefromcart = async (productId, quantity = 1) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/removefromcart`,
        {
          data: { productId, quantity },
          withCredentials: true,
        }
      );
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCart,
        addcart,
        removefromcart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
