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
  item_image_paths: string | null;
  category_name: string | null;
}

interface StoreGroup {
  store_id: string | null;
  store_name: string | null;
  store_email: string | null;
  store_bio: string | null;
  store_logo: string | null;
  items: CartItem[];
}

interface PendingCartItem {
  cart_id: string;
  quantity: number;
  item_id: string | null;
  item_name: string | null;
  item_price: number | null;
  item_description: string | null;
  item_image_paths: string[] | null;
  category_name: string | null;
}

interface PendingStoreOrder {
  store_id: string | null;
  store_name: string | null;
  store_email: string | null;
  store_bio: string | null;
  store_logo: string | null;
  items: PendingCartItem[];
  url_not_paid: string;
  token: string;
  order_id: string;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function CartPage() {
  const router = useRouter();
  const [storeGroups, setStoreGroups] = useState<StoreGroup[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingStoreOrder[]>([]);
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
        setStoreGroups(res.data.data);
      } else {
        console.error('Failed to fetch cart items:', res.data);
      }
    } catch (err) {
      console.error('Error fetching cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart/settled`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        setPendingOrders(response.data);
      } else {
        console.error('Failed to fetch pending orders:', response.data);
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  };

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

  const handleCheckout = async () => {
    try {
      const payload = {
        accessToken,
        cartItems: storeGroups.map((store) => ({
          store_id: store.store_id,
          items: store.items,
        })),
      };
      const response = await axios.post(`${API_URL}/api/payment`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        const snapToken = response.data.data.token;
        window.snap.pay(snapToken, {
          onSuccess: async function (result: any) {
            try {
              await axios.patch(
                `${API_URL}/api/payment/update-status`,
                { orderId: response.data.orderId },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
              alert('Payment successful and status updated!');
              router.push('/cart');
              router.refresh();
            } catch (updateError) {
              console.error('Error updating payment status:', updateError);
              alert('Payment succeeded, but failed to update payment status.');
            }
          },
          onPending: function (result: undefined) {
            console.log('Payment pending:', result);
            alert('Payment is pending.');
          },
          onError: function (result: undefined) {
            console.error('Payment error:', result);
            alert('Payment failed.');
          },
          onClose: function () {
            console.log('User closed the popup without finishing the payment.');
            alert('You closed the payment popup.');
          },
        });
      } else {
        alert('Failed to create transaction.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error occurred during checkout.');
    }
  };

  const handlePayNotPaid = async (
    urlNotPaid: string,
    orderId: string,
    token: string
  ) => {
    if (typeof window !== 'undefined' && window.snap) {
      window.snap.pay(token, {
        onSuccess: async function (result: any) {
          try {
            await axios.patch(
              `${API_URL}/api/payment/update-status`,
              { orderId },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            alert('Payment successful and status updated!');
            router.push('/cart');
            router.refresh();
          } catch (updateError) {
            console.error('Error updating payment status:', updateError);
            alert('Payment succeeded, but failed to update payment status.');
          }
        },
        onPending: function (result: any) {
          console.log('Payment pending:', result);
          alert('Payment is pending.');
        },
        onError: function (result: any) {
          console.error('Payment error:', result);
          alert('Payment failed.');
        },
        onClose: function () {
          console.log('User closed the popup without finishing the payment.');
          alert('You closed the payment popup.');
        },
      });
    } else {
      alert('Midtrans Snap is not loaded yet. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchPendingOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      {/*  */}
      {pendingOrders.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <Typography variant="h4" gutterBottom>
            Your Shopping Not Paid
          </Typography>
          {pendingOrders.map((store) => (
            <Card
              key={store.store_id || 'unknown-store'}
              sx={{
                mb: 2,
                p: 1,
                backgroundColor: '#f9f9f9',
                mx: 'auto',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {store.store_name || 'Unknown Store'}
                </Typography>
                <Grid container spacing={2}>
                  {store.items.map((item) => (
                    <Grid item xs={12} md={6} lg={4} key={item.cart_id}>
                      <Card variant="outlined" sx={{ display: 'flex', mb: 1 }}>
                        {item.item_image_paths &&
                          item.item_image_paths.length > 0 && (
                            <div
                              style={{
                                position: 'relative',
                                width: '120px',
                                height: '120px',
                                marginRight: '1rem',
                              }}
                            >
                              <Image
                                src={item.item_image_paths[0]}
                                alt={item.item_name || 'Item Image'}
                                layout="fill"
                                objectFit="contain"
                              />
                            </div>
                          )}
                        <CardContent sx={{ flex: '1 0 auto', p: 1 }}>
                          <Typography variant="subtitle1">
                            {item.item_name || 'Unnamed Item'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} x Rp. {item.item_price || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.item_description || ''}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              <CardActions>
                {store.url_not_paid && store.order_id && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      handlePayNotPaid(
                        store.url_not_paid,
                        store.order_id,
                        store.token
                      )
                    }
                  >
                    Pay Now
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </div>
      )}
      {/*  */}

      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>
      {/*  */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </div>
      ) : storeGroups.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Typography>No items in your cart.</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/')}
          >
            Browse Items
          </Button>
        </div>
      ) : (
        <div>
          {storeGroups.map((store) => (
            <div
              key={store.store_id || 'unknown-store'}
              style={{ marginBottom: '2rem' }}
            >
              <Typography variant="h5" gutterBottom>
                {store.store_name || 'Unknown Store'}
              </Typography>
              {store.store_logo && (
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    position: 'relative',
                    marginBottom: '1rem',
                  }}
                >
                  <Image
                    src={store.store_logo}
                    alt={store.store_name || 'Store Logo'}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              )}
              <Grid container spacing={2}>
                {store.items.map((item) => {
                  const localQty =
                    quantities[item.cart_id] !== undefined
                      ? quantities[item.cart_id]
                      : item.quantity;
                  return (
                    <Grid item xs={12} md={6} lg={4} key={item.cart_id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          {item.item_image_paths && (
                            <div
                              style={{
                                width: '100%',
                                height: '200px',
                                position: 'relative',
                              }}
                            >
                              <Image
                                src={item.item_image_paths[0]}
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
                            {item.item_description ||
                              'No description available'}
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
                              handleQtyChange(
                                item.cart_id,
                                Number(e.target.value)
                              )
                            }
                            inputProps={{ min: 1 }}
                            sx={{ width: '80px' }}
                          />
                        </CardContent>

                        <CardActions
                          sx={{ justifyContent: 'space-between', px: 2 }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleUpdateQty(item.cart_id, localQty)
                            }
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
              {/*  */}
            </div>
            //
          ))}
        </div>
        //
      )}
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Checkout
        </Button>
      </div>
    </div>
  );
}
