'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import defaultJpg from '@/public/default.webp';
import { itemStore } from '../DTO/itemStore';
import CardItemStore from '../component/CardItemStore';
import { Typography } from '@mui/material';
import { StoreResponse } from '../DTO/store';
import CardStore from './CardStore';
const Section = () => {
	const [items, setItems] = useState<StoreResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const accessToken = Cookies.get('accessToken');
	useEffect(() => {
		const fetchItemStores = async () => {
			try {
				const response = await axios.get<{
					success: boolean;
					data: { record: number; item: StoreResponse[] };
				}>(`${process.env.API_URL}/api/user/store`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (response.data) {
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
				STORE
			</Typography>
			<div className='grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 mt-4'>
				{items?.map(item => {
					return (
						<CardStore
							key={item.id}
							image={item.logo}
							name={item.name}
							kecamatan={item.address.kecamatan}
							kota={item.address.kota}
						/>
					);
				})}
			</div>
		</section>
	);
};

export default Section;
