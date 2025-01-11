'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
} from '@mui/material';

interface CartItem {
  id: string;
  itemStoreId: string;
  qty: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const API_URL = process.env.API_URL;
  const accessToken = Cookies.get('accessToken');

  const fetchCartItems = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/remove`, {
        data: {
          accessToken,
          itemStoreId: cartItemId,
        },
      });
      if (response.data.success) {
        alert('Item removed successfully!');
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item.');
    }
  };

  const handleUpdateQty = async (cartItemId: string, qty: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/cart/update-qty`, {
        accessToken,
        itemStoreId: cartItemId,
        qty,
      });
      if (response.data.success) {
        alert('Quantity updated successfully!');
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity.');
    }
  };

  const handleQtyChange = (cartItemId: string, newQty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [cartItemId]: newQty,
    }));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : cartItems.length === 0 ? (
        <Typography>No items in your cart.</Typography>
      ) : (
        <Grid container spacing={2}>
          {cartItems.map((item) => {
            const localQty = quantities[item.id] ?? item.qty;
            return (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="body1">
                      ItemStore ID: {item.itemStoreId}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Quantity:
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={localQty}
                      onChange={(e) =>
                        handleQtyChange(item.id, Number(e.target.value))
                      }
                      inputProps={{ min: 1 }}
                      sx={{ width: '80px' }}
                    />
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateQty(item.id, localQty)}
                    >
                      Update Quantity
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove Item
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
}
