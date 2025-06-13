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
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableCell,
	TableRow,
	TableBody,
	Stack,
	IconButton,
} from '@mui/material';
import Image from 'next/image';
import shopPng from '@/public/shopPng.png';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { formatNumber } from '../utils/formatNumber';

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
		setQuantities(prev => ({
			...prev,
			[cartId]: newQty,
		}));
	};

	const handleCheckout = async (storeid: string) => {
		try {
			const filteredStores = storeGroups.filter(store => store.store_id === storeid);

			if (filteredStores.length === 0) {
				alert('Store not found in cart.');
				setLoading(false);
				return;
			}

			const payload = {
				accessToken,
				cartItems: filteredStores.map(store => ({
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
							fetchCartItems();
							fetchPendingOrders();
							router.push('/cart');
							router.refresh();
						} catch (updateError) {
							console.log('Error updating payment status:', updateError);

							fetchCartItems();
							console.error('Error updating payment status:', updateError);
							alert('Payment succeeded, but failed to update payment status.');
						}
					},
					onPending: function (result: undefined) {
						console.log('Payment pending:', result);
						fetchCartItems();
						fetchPendingOrders();
						alert('Payment is pending.');
					},
					onError: function (result: undefined) {
						console.error('Payment error:', result);
						fetchCartItems();
						fetchPendingOrders();
						alert('Payment failed.');
					},
					onClose: function () {
						console.log('User closed the popup without finishing the payment.');
						fetchCartItems();
						fetchPendingOrders();
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

	const handlePayNotPaid = async (urlNotPaid: string, orderId: string, token: string) => {
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
						fetchCartItems();
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

	const handleCancelOrder = async (orderId: string) => {
		try {
			const response = await axios.post(`${API_URL}/api/cart/cancel-order`, {
				accessToken,
				orderId,
			});
			if (response.data.success) {
				alert(response.data.message);
				fetchPendingOrders();
			} else {
				alert('Failed to cancel order');
			}
		} catch (error) {
			console.error('Error cancelling order:', error);
			alert('Failed to cancel order.');
		}
	};

	useEffect(() => {
		fetchCartItems();
		fetchPendingOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const hasCartItems = storeGroups.some(store => store.items.length > 0);

	return (
		<Stack
			sx={{ padding: '1rem', minHeight: '100vh' }}
			alignItems='center'>
			<Stack sx={{ minWidth: { xs: '100%', md: '60rem' }, maxWidth: { xs: '100%', md: '70rem' } }}>
				{pendingOrders.length > 0 && (
					<div style={{ marginBottom: '1rem' }}>
						<Typography
							variant='h4'
							gutterBottom>
							Yuk Bayar Pesanan Kamu
						</Typography>
						{pendingOrders.map(store => (
							<Card
								key={store.store_id || 'unknown-store'}
								sx={{ mb: 2, p: 1, backgroundColor: '#f9f9f9', mx: 'auto' }}>
								<CardContent>
									<Typography
										variant='h6'
										gutterBottom>
										{store.store_name || 'Unknown Store'}
									</Typography>
									<Grid
										container
										spacing={2}>
										{store.items.map(item => (
											<Grid
												item
												xs={12}
												md={6}
												lg={4}
												key={item.cart_id}>
												<Card
													variant='outlined'
													sx={{ display: 'flex', mb: 1 }}>
													{item.item_image_paths && item.item_image_paths.length > 0 && (
														<div style={{ position: 'relative', width: '120px', height: '120px', marginRight: '1rem' }}>
															<Image
																src={item.item_image_paths[0]}
																alt={item.item_name || 'Item Image'}
																layout='fill'
																objectFit='contain'
															/>
														</div>
													)}
													<CardContent sx={{ flex: '1 0 auto', p: 1 }}>
														<Typography variant='subtitle1'>{item.item_name || 'Unnamed Item'}</Typography>
														<Typography
															variant='body2'
															color='text.secondary'>
															{item.quantity} x Rp. {item.item_price || 0}
														</Typography>
														<Typography
															variant='body2'
															color='text.secondary'>
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
										<>
											<Button
												variant='contained'
												color='secondary'
												onClick={() => handlePayNotPaid(store.url_not_paid, store.order_id, store.token)}>
												Bayar Sekarang
											</Button>
											<Button
												variant='outlined'
												color='error'
												onClick={() => handleCancelOrder(store.order_id)}>
												Batalkan Pesanan
											</Button>
										</>
									)}
								</CardActions>
							</Card>
						))}
					</div>
				)}
				{/*  */}
				<Typography
					variant='h4'
					gutterBottom>
					{hasCartItems ? 'Keranjang Belanja' : 'Keranjang Kosong'}
				</Typography>
				{/*  */}
				{loading ? (
					<div style={{ textAlign: 'center', marginTop: '2rem' }}>
						<CircularProgress />
					</div>
				) : storeGroups.length === 0 ? (
					<div style={{ textAlign: 'center', marginTop: '2rem', justifyContent: 'center' }}>
						<Image
							src={shopPng}
							alt='Empty Cart'
							width={200}
							height={200}
							style={{ margin: '1rem auto' }}
						/>
						<Button
							variant='contained'
							color='primary'
							onClick={() => router.push('/')}>
							Belanja Sekarang
						</Button>
					</div>
				) : (
					<Stack gap={2}>
						{storeGroups.map(store => (
							<Stack
								padding={2}
								border={1}
								borderColor='#e0e0e0'
								key={store.store_id || 'unknown-store'}>
								<Typography
									variant='h5'
									gutterBottom>
									{store.store_name || 'Unknown Store'}
								</Typography>

								<TableContainer component={Paper}>
									<Table aria-label='store items table'>
										<TableHead>
											<TableRow>
												<TableCell>Gambar</TableCell>
												<TableCell>Barang</TableCell>
												<TableCell>Harga (Rp.)</TableCell>
												<TableCell>Jumlah</TableCell>
												<TableCell align='center'></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{store.items.map(item => {
												const localQty = quantities[item.cart_id] !== undefined ? quantities[item.cart_id] : item.quantity;
												return (
													<TableRow key={item.cart_id}>
														<TableCell>
															{item.item_image_paths && item.item_image_paths.length > 0 && (
																<div style={{ width: 60, height: 60, position: 'relative' }}>
																	<Image
																		src={item.item_image_paths[0]}
																		alt={item.item_name || 'Item Image'}
																		layout='fill'
																		objectFit='contain'
																	/>
																</div>
															)}
														</TableCell>
														<TableCell>{item.item_name || 'Unknown Item'}</TableCell>
														<TableCell>{formatNumber(item.item_price || 0)}</TableCell>
														<TableCell>
															<TextField
																type='number'
																size='small'
																value={localQty}
																onChange={e => handleQtyChange(item.cart_id, Number(e.target.value))}
																inputProps={{ min: 1 }}
																sx={{ width: '80px' }}
															/>
														</TableCell>
														<TableCell align='center'>
															<Button
																variant='contained'
																color='primary'
																size='small'
																onClick={() => handleUpdateQty(item.cart_id, localQty)}
																sx={{ mr: 1 }}>
																Perbarui
															</Button>
															<IconButton
																color='error'
																size='small'
																onClick={() => handleRemoveItem(item.cart_id)}>
																<DeleteOutlineOutlinedIcon />
															</IconButton>
														</TableCell>
													</TableRow>
												);
											})}
											<TableRow>
												<TableCell
													colSpan={5}
													align='right'>
													<strong>Total : Rp. {formatNumber(store.items.reduce((acc, item) => acc + (item.item_price || 0) * (quantities[item.cart_id] || item.quantity), 0))}</strong>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
								{hasCartItems && (
									<div style={{ marginTop: '2rem', textAlign: 'right' }}>
										<Button
											variant='contained'
											color='primary'
											sx={{
												gap: 2,
											}}
											onClick={() => handleCheckout(store.store_id || '')}>
											Checkout
										</Button>
									</div>
								)}
							</Stack>
						))}
					</Stack>
				)}
			</Stack>
		</Stack>
	);
}
