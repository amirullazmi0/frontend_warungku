'use client';

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Tron from './component/user/Tron';
import CardItemStore from './component/CardItemStore';
import Cookies from 'js-cookie';
import { itemStore } from './DTO/itemStore';
import defaultJpg from '@/public/default.webp';
import { Box, Divider, Typography } from '@mui/material';
import { FormNavContext } from './component/context/FormNavContext';

const Section = () => {
	const [items, setItems] = useState<itemStore[]>([]);
	const [itemsFilter, setItemsFilter] = useState<itemStore[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const accessToken = Cookies.get('accessToken');

	const formNavContext = useContext(FormNavContext);
	if (!formNavContext) {
		console.error('Error: FormNavContext is not provided!');
		return null;
	}

	const keyword = formNavContext.keyword?.trim() || null;
	const category = formNavContext.category;

	const fetchItemStores = async () => {
		try {
			setLoading(true);

			const queryParams = new URLSearchParams();
			if (keyword) queryParams.append('keyword', keyword);
			if (category && category.length > 0) {
				queryParams.append('category', category.join(','));
			}

			const apiUrl = process.env.API_URL;
			if (!apiUrl) throw new Error('API_URL is not defined in environment variables');

			if (!accessToken) throw new Error('Access token is missing');

			const response = await axios.get<{
				success: boolean;
				data: { record: number; item: itemStore[] };
			}>(`${apiUrl}/api/user/item-store?${queryParams.toString()}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (response.data.success) {
				if (keyword) {
					setItemsFilter(response.data.data.item);
				} else {
					setItems(response.data.data.item);
					setItemsFilter(null);
				}
			} else {
				console.warn('API request failed:', response.data);
				setItems([]);
				setItemsFilter([]);
			}
		} catch (error: any) {
			console.error('Failed to fetch item stores:', error.response?.data || error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchItemStores();
	}, [keyword, category]);

	const filteredItemIds = new Set(itemsFilter?.map(item => item.id) || []);
	const otherItems = items.filter(item => !filteredItemIds.has(item.id));

	if (loading) {
		return (
			<section>
				<div className='p-5 text-center'>Loading items...</div>;
			</section>
		);
	}

	return (
		<section>
			<Tron />
			<div className='grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 mt-4'>
				{keyword && itemsFilter && itemsFilter.length > 0 && (
					<>
						<Typography className='col-span-full text-xl font-bold'>Hasil Pencarian:</Typography>
						{itemsFilter.map(item => (
							<CardItemStore
								key={item.id}
								storeId={item.store.id}
								storeName={item.store.name}
								name={item.name}
								address={item.storeAddress?.kota ? item.storeAddress.kota : 'Unknown address'}
								images={item.itemStorageImage[0]?.path ? item.itemStorageImage[0].path : defaultJpg.src}
								price={item.price}
								wishlist={item.wishlist}
								itemId={item.id}
							/>
						))}
					</>
				)}

				{!keyword && otherItems.length > 0 && (
					<>
						{otherItems.map(item => (
							<CardItemStore
								key={item.id}
								storeId={item.store.id}
								storeName={item.store.name}
								name={item.name}
								address={item.storeAddress?.kota ? item.storeAddress.kota : 'Unknown address'}
								images={item.itemStorageImage[0]?.path ? item.itemStorageImage[0].path : defaultJpg.src}
								price={item.price}
								wishlist={item.wishlist}
								itemId={item.id}
							/>
						))}
					</>
				)}

				{keyword && otherItems.length == 0 && (
					<>
						<Typography className='col-span-full text-xl font-bold'>Hasil Pencarian:</Typography>
						<Box className='lg:col-span-6 md:col-span-4 col-span-2 w-full'>
							<Typography
								className='pt-10 mb-10'
								variant='h3'
								textAlign={'center'}>
								Tidak Ada Item
							</Typography>
						</Box>
						<Typography className='col-span-full text-xl font-bold mt-4'>Barang Lainnya:</Typography>
						{otherItems.map(item => (
							<CardItemStore
								key={item.id}
								storeId={item.store.id}
								storeName={item.store.name}
								name={item.name}
								address={item.storeAddress?.kota ? item.storeAddress.kota : 'Unknown address'}
								images={item.itemStorageImage[0]?.path ? item.itemStorageImage[0].path : defaultJpg.src}
								price={item.price}
								wishlist={item.wishlist}
								itemId={item.id}
							/>
						))}
					</>
				)}

				{keyword && otherItems.length > 0 && (
					<>
						<Typography className='col-span-full text-xl font-bold mt-4'>Barang Lainnya:</Typography>
						{otherItems.map(item => (
							<CardItemStore
								key={item.id}
								storeId={item.store.id}
								storeName={item.store.name}
								name={item.name}
								address={item.storeAddress?.kota ? item.storeAddress.kota : 'Unknown address'}
								images={item.itemStorageImage[0]?.path ? item.itemStorageImage[0].path : defaultJpg.src}
								price={item.price}
								wishlist={item.wishlist}
								itemId={item.id}
							/>
						))}
					</>
				)}
			</div>
		</section>
	);
};

export default Section;
