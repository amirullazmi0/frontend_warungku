'use client';
import React, { useEffect, useState } from 'react';
import Tron from './component/user/Tron';
import CardItemStore from './component/CardItemStore';
import { itemStoreType } from './DTO/itemStore';
import axios from 'axios';
import Cookies from 'js-cookie';

const Section = () => {
	const apiUrl = process.env.API_URL;
	const access_token = Cookies.get('accessToken');

	const [itemStore, setItemStore] = useState<itemStoreType[]>();

	const getData = async () => {
		try {
			const response: {
				data: {
					data: {
						record: number;
						item: itemStoreType[];
					};
				};
			} = await axios.get(`${apiUrl}/api/user/item-store`, {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			});

			if (response.data) {
				setItemStore(response.data.data.item);
			}
		} catch (error) {}
	};

	useEffect(() => {
		getData();
	}, []);
	return (
		<section>
			<Tron />
			<div className='card bg-white mt-4 shadow-lg'>
				<div className='card-body grid grid-cols-4 gap-4'>
					{itemStore?.map((item, index) => {
						return (
							<CardItemStore
								key={index}
								name={item.name}
								address={item.storeAddress.provinsi ?? 'indonesia'}
								images={item.itemStorageImage.path}
								price={item.price}
								wishlist=''
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default Section;
