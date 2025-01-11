'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
} from '@mui/material';
import Image from 'next/image';

interface CartItem {
  cart_id: string;
  quantity: number;
  item_id: string | null;
  item_name: string | null;
  item_price: number | null;
  item_description: string | null;
  item_image_path: string | null;
  category_name: string | null;
}

export default function CartPage() {
  const router = useRouter();
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
  }, []);

  const handleRemoveItem = async (cartId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/remove`, {
        data: {
          accessToken,
          itemStoreId: cartId,
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

  const handleUpdateQty = async (cartId: string, qty: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/cart/update-qty`, {
        accessToken,
        itemStoreId: cartId,
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

  const handleQtyChange = (cartId: string, newQty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [cartId]: newQty,
    }));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </div>
      ) : cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Typography>No items in your cart.</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/browse')}
          >
            Browse Items
          </Button>
        </div>
      ) : (
        <Grid container spacing={2}>
          {cartItems.map((item) => {
            const localQty =
              quantities[item.cart_id] !== undefined
                ? quantities[item.cart_id]
                : item.quantity;

            return (
              <Grid item xs={12} md={6} lg={4} key={item.cart_id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    {item.item_image_path && (
                      <div
                        style={{
                          width: '100%',
                          height: '200px',
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={item.item_image_path}
                          alt={item.item_name || 'Item Image'}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    )}
                    <Typography variant="h6" gutterBottom>
                      {item.item_name || 'Unknown Item'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Price: Rp. {item.item_price || 0}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {item.item_description || 'No description available'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Category: {item.category_name || 'Uncategorized'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity:
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={localQty}
                      onChange={(e) =>
                        handleQtyChange(item.cart_id, Number(e.target.value))
                      }
                      inputProps={{ min: 1 }}
                      sx={{ width: '80px' }}
                    />
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateQty(item.cart_id, localQty)}
                    >
                      Update Quantity
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveItem(item.cart_id)}
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
