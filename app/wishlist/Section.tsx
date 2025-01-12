'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import defaultJpg from '@/public/default.webp';
import { itemStore } from '../DTO/itemStore';
import CardItemStore from '../component/CardItemStore';
import { Typography } from '@mui/material';
const Section = () => {
	const [items, setItems] = useState<itemStore[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const accessToken = Cookies.get('accessToken');
	useEffect(() => {
		const fetchItemStores = async () => {
			try {
				const response = await axios.get<{
					success: boolean;
					data: { record: number; item: itemStore[] };
				}>(`${process.env.API_URL}/api/user/item-store`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (response.data.success) {
					console.log(response.data);
					setItems(response.data.data.item);
				}
			} catch (error) {
				console.error('Failed to fetch item stores:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchItemStores();
	}, []);

	if (loading) {
		return <div className='p-5'>Loading items...</div>;
	}

	return (
		<section>
			<Typography
				variant='h5'
				fontWeight={600}>
				Your Wish List ❤️
			</Typography>
			<div className='grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 mt-4'>
				{items.map(item => {
					if (item.wishlist) {
						return (
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
						);
					}
				})}
			</div>
		</section>
	);
};

export default Section;
