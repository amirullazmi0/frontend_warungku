'use client';
import { StoreResponse, StoreWithItems } from '@/app/DTO/store';
import { Box, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import CardItemStore from '@/app/component/CardItemStore';
import { itemStore } from '@/app/DTO/itemStore';
import defaultJpg from '@/public/default.webp';
import Image from 'next/image';

const Section = () => {
	const id = useParams()['id'];
	const [store, setStore] = useState<StoreResponse>();
	const [itemStore, setItemStore] = useState<itemStore[]>();
	const [loading, setLoading] = useState<boolean>(true);
	const accessToken = Cookies.get('accessToken');

	useEffect(() => {
		const fetchStores = async () => {
			try {
				const response = await axios.get<{
					success: boolean;
					data: { record: number; item: StoreResponse[] };
				}>(`${process.env.API_URL}/api/user/store/${id}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (response.data) {
					setStore(response.data.data.item[0]);
				}
			} catch (error) {
				console.error('Failed to fetch item stores:', error);
			} finally {
				setLoading(false);
			}
		};

		const fetchItemStores = async () => {
			try {
				const response = await axios.get<{
					success: boolean;
					data: itemStore[];
				}>(`${process.env.API_URL}/api/user/store/${id}/item`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (response.data) {
					setItemStore(response.data.data);
				}
			} catch (error) {
				console.error('Failed to fetch item stores:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchItemStores();
		fetchStores();
	}, []);

	if (loading) {
		return (
			<section>
				<div className='p-5'>Loading items...</div>;
			</section>
		);
	}
	return (
		<section>
			<Stack>
				<Stack
					padding={2}
					borderRadius={4}
					bgcolor={'white'}
					justifyContent={'center'}
					alignItems={'center'}>
					<Box>
						<Image
							src={store?.logo ? store.logo : defaultJpg.src}
							alt='Store Logo'
							width={200}
							height={200}
						/>
					</Box>
					<Typography
						variant='h5'
						fontWeight={800}>
						{store?.name}
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'>
						{store?.address?.jalan}, {store?.address?.kecamatan} {store?.address?.kota && `, ${store.address.kota}`}
					</Typography>
				</Stack>
				<Stack>
					<div className='grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 mt-4'>
						{store && itemStore && itemStore?.length > 0
							? itemStore.map((item, index) => {
									return (
										<CardItemStore
											key={index}
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
							  })
							: 'No items available'}
					</div>
				</Stack>
			</Stack>
		</section>
	);
};

export default Section;
