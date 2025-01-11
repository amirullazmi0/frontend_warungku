'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface CartItem {
  id: string;
  itemStoreId: string;
  qty: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const API_URL = process.env.API_URL;
  const accessToken = Cookies.get('accessToken');

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        setCartItems(res.data.data);
      } else {
        console.error('Failed to fetch cart items:', res.data);
      }
    } catch (err) {
      console.error('Error fetching cart items:', err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>No items in your cart.</div>
      ) : (
        <div className="flex flex-col space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="p-2 border rounded">
              <p>CartItem ID: {item.id}</p>
              <p>ItemStore ID: {item.itemStoreId}</p>
              <p>Quantity: {item.qty}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
