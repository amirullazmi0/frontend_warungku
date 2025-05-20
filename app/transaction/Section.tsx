'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
	Box,
	Typography,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Stack,
} from '@mui/material';
import { statusPayment } from './transaction';
import StatusChip from './StatusChip';
import { formatCurrency } from '../utils/formatCurrency';

const TransactionsSection: React.FC = () => {
	const [transactions, setTransactions] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedItems, setSelectedItems] = useState<any[]>([]);

	const API_URL = process.env.API_URL;
	const accessToken = Cookies.get('accessToken');

	// Function to fetch all transactions for the logged-in user
	const fetchTransactions = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API_URL}/transaction/allByUser`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			console.log('Transactions:', response.data);
			setTransactions(response.data);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (accessToken) {
			fetchTransactions();
		}
	}, [accessToken]);

	// Open dialog to view items from the separate "items" field
	const handleViewItems = (items: any[]) => {
		console.log('Viewing items:', items);
		setSelectedItems(items || []);
		setOpenDialog(true);
	};

	// Close dialog
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedItems([]);
	};

	return (
		<section>
			<Stack
				justifyContent='center'
				alignItems='center'>
				<Stack
					sx={{
						width: {
							xs: '100%',
							md: '80%',
						},
					}}>
					<Typography
						variant='h4'
						gutterBottom>
						Daftar Transaksi
					</Typography>
					{loading ? (
						<CircularProgress />
					) : transactions.length > 0 ? (
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>No</TableCell>
										<TableCell>Invoice</TableCell>
										<TableCell>tanggal</TableCell>
										<TableCell>Total</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Lihat Item</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{transactions.map((tx, index) => {
										const status: statusPayment = tx.invoice?.status;
										console.log(tx);

										return (
											<TableRow key={tx.transaction_id}>
												<TableCell>{index + 1}</TableCell>
												<TableCell>{tx.invoice?.invoiceNumber || 'N/A'}</TableCell>
												<TableCell>{new Date(tx.createdat).toLocaleString()}</TableCell>
												<TableCell>{formatCurrency(tx.total)}</TableCell>
												<TableCell>
													<StatusChip status={status} />
												</TableCell>
												<TableCell>
													<Button
														variant='outlined'
														onClick={() => handleViewItems(tx.invoice.items || [])}>
														Lihat Item
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<Typography>Tidak ada transaksi</Typography>
					)}

					{/* Dialog to show item details */}
					<Dialog
						open={openDialog}
						onClose={handleCloseDialog}
						maxWidth='md'
						fullWidth>
						<DialogTitle>Transaction Items</DialogTitle>
						<DialogContent dividers>
							{selectedItems.length === 0 ? (
								<Typography>Tidak ada item yang ditemukan.</Typography>
							) : (
								<TableContainer component={Paper}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Gambar</TableCell>
												<TableCell>Nama</TableCell>
												<TableCell>Jumlah</TableCell>
												<TableCell>Harga</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{selectedItems.map((item, idx) => (
												<TableRow key={idx}>
													<TableCell>
														<img
															src={item.images}
															alt={item.itemName}
															style={{
																width: '80px',
																height: '80px',
																objectFit: 'cover',
															}}
														/>
													</TableCell>
													<TableCell>{item.itemName}</TableCell>
													<TableCell>{item.qty}</TableCell>
													<TableCell>{formatCurrency(item.price)}</TableCell>
												</TableRow>
											))}

											<TableRow>
												<TableCell
													colSpan={3}
													align='right'>
													<strong>Total:</strong>
												</TableCell>
												<TableCell>
													<strong>{formatCurrency(selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0))}</strong>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</DialogContent>
						<DialogActions>
							<Button
								onClick={handleCloseDialog}
								variant='contained'
								color='primary'>
								Keluar
							</Button>
						</DialogActions>
					</Dialog>
				</Stack>
			</Stack>
		</section>
	);
};

export default TransactionsSection;
