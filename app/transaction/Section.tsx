'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
			<Typography
				variant='h4'
				gutterBottom>
				Your Transactions
			</Typography>
			{loading ? (
				<CircularProgress />
			) : transactions.length > 0 ? (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Order Number</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Total</TableCell>
								<TableCell>Address</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>View Items</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{transactions.map(tx => {
								const status: statusPayment = tx.invoice?.status;
								return (
									<TableRow key={tx.transaction_id}>
										<TableCell>{tx.invoice?.invoiceNumber || 'N/A'}</TableCell>
										<TableCell>{new Date(tx.createdat).toLocaleString()}</TableCell>
										<TableCell>{formatCurrency(tx.total)}</TableCell>
										<TableCell>
											{tx.customer_address} {tx.customer_city}
										</TableCell>
										<TableCell>
											<StatusChip status={status} />
										</TableCell>
										<TableCell>
											<Button
												variant='outlined'
												onClick={() => handleViewItems(tx.invoice.items || [])}>
												View Items
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Typography>No transactions found.</Typography>
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
						<Typography>No items available.</Typography>
					) : (
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Image</TableCell>
										<TableCell>Item Name</TableCell>
										<TableCell>Quantity</TableCell>
										<TableCell>Price</TableCell>
										<TableCell>Description</TableCell>
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
											<TableCell>{item.desc}</TableCell>
										</TableRow>
									))}
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
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</section>
	);
};

export default TransactionsSection;
