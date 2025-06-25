'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import TronGuest from './TronGuest';
import Cookies from 'js-cookie';
import { FormNavContext } from '../component/context/FormNavContext';
import { itemStore } from '../DTO/itemStore';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import CardItemStoreGuest from './CardItemStoreGuest';
import defaultJpg from '@/public/default.webp';

const SectionInner = () => {
	const formNavContext = useContext(FormNavContext);

	if (!formNavContext) {
		throw new Error('FormNavContext is not provided!');
	}

	const [items, setItems] = useState<itemStore[]>([]);
	const [itemsFilter, setItemsFilter] = useState<itemStore[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const accessToken = Cookies.get('accessToken');

	const keyword = formNavContext.keyword?.trim() || null;
	const category = formNavContext.category;

	const fetchItemStores = useCallback(async () => {
		try {
			setLoading(true);

			const queryParams = new URLSearchParams();
			if (keyword) queryParams.append('keyword', keyword);
			if (category && category.length > 0) {
				queryParams.append('category', category.join(','));
			}

			const apiUrl = process.env.API_URL;
			if (!apiUrl) throw new Error('API_URL is not defined in environment variables');

			const response = await axios.get<{
				success: boolean;
				data: { record: number; item: itemStore[] };
			}>(`${apiUrl}/guest/item-store?${queryParams.toString()}`);

			if (response.data.success) {
				if (keyword || category.length > 0) {
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
			setItems([]);
			setItemsFilter([]);
		} finally {
			setLoading(false);
		}
	}, [keyword, category, accessToken]);

	useEffect(() => {
		fetchItemStores();
	}, [fetchItemStores]);

	const filteredItemIds = new Set(itemsFilter?.map(item => item.id) || []);
	const otherItems = items.filter(item => !filteredItemIds.has(item.id));

	const isItemsEmpty = (keyword || category.length > 0) && itemsFilter?.length === 0;

	if (loading) {
		return (
			<section>
				<div className='p-5 text-center'>Loading items...</div>
			</section>
		);
	}

	return (
		<section>
			<TronGuest />
			<div className='grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 mt-4'>
				{/* Combined message for when no keyword or category match */}
				{isItemsEmpty && (
					<>
						<Typography className='col-span-full text-xl font-bold'>Barang Tidak Ditemukan</Typography>
						<Box className='lg:col-span-6 md:col-span-4 col-span-2 w-full'>
							<Typography
								variant='h5'
								textAlign='center'
								className='pt-10 mb-10'>
								Tidak ada barang yang sesuai dengan pencarian atau kategori yang dipilih.
							</Typography>
						</Box>
					</>
				)}

				{/* Filtered items based on keyword */}
				{keyword && itemsFilter && itemsFilter.length > 0 && (
					<>
						<Typography className='col-span-full text-xl font-bold'>Hasil Pencarian:</Typography>
						{itemsFilter.map(item => (
							<CardItemStoreGuest
								key={item.id}
								storeId={item.store.id}
								storeName={item.store.name}
								name={item.name}
								address={item.storeAddress?.kota ?? 'Unknown address'}
								images={item.itemStorageImage[0]?.path ?? defaultJpg.src}
								price={item.price}
								itemId={item.id}
							/>
						))}
					</>
				)}

				{/* Filtered items based on category */}
				{category && category.length > 0 && itemsFilter && itemsFilter?.length > 0 && (
					<>
						<Typography className='col-span-full text-xl font-bold'>Barang di Kategori:</Typography>
						{itemsFilter.map(item => (
							<CardItemStoreGuest
								key={item.id}
								storeId={item.store.id}
								storeName={item.store.name}
								name={item.name}
								address={item.storeAddress?.kota ?? 'Unknown address'}
								images={item.itemStorageImage[0]?.path ?? defaultJpg.src}
								price={item.price}
								itemId={item.id}
							/>
						))}
					</>
				)}

				{/* Items without keyword */}
				{!keyword && otherItems.length > 0 && (
					<>
						{otherItems.map(item => (
							<CardItemStoreGuest
								key={item.id}
								storeId={item.store.id}
								storeName={item.store.name}
								name={item.name}
								address={item.storeAddress?.kota ?? 'Unknown address'}
								images={item.itemStorageImage[0]?.path ?? defaultJpg.src}
								price={item.price}
								itemId={item.id}
							/>
						))}
					</>
				)}

				{/* Show "Barang Lainnya" if other items exist but don't match the keyword */}

				{/* Items in the selected category */}
				{category && category.length > 0 && itemsFilter?.length === 0 && otherItems.length === 0 && (
					<Typography className='col-span-full text-xl font-bold mt-4'>Tidak ada barang di kategori ini.</Typography>
				)}
			</div>
		</section>
	);
};

const Section = () => {
	return <SectionInner />;
};

export default Section;
