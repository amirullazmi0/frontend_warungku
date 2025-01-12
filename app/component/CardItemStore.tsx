'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import Cookies from 'js-cookie';
import { formatCurrency } from '../utils/formatCurrency';

interface Props {
	images: string | string[];
	name: string;
	price: number;
	address: string;
	wishlist: boolean;
	itemId: string;
	storeId: string;
	storeName: string;
}

const CardItemStore: React.FC<Props> = ({ images, name, price, address, wishlist, itemId, storeId, storeName }) => {
	const [wishListStatus, setWishListStatus] = useState<boolean>(wishlist);
	const accessToken = Cookies.get('accessToken');

	const handleWishListStatus = () => {
		console.log('wwkkw');

		updateWishlist();
		setWishListStatus(prev => !prev);
	};

	const updateWishlist = async () => {
		try {
			const response = await axios.post(
				`${process.env.API_URL}/api/user/wishlist`,
				{
					itemStoreId: itemId,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			console.log(response.data);
		} catch (error) {}
	};

	const handleAddToCart = async () => {
		try {
			const response = await axios.post(`${process.env.API_URL}/api/cart/add`, {
				accessToken,
				itemStoreId: itemId,
				qty: 1,
			});

			if (response.data.success) {
				alert('Item added to cart successfully!');
			}
		} catch (error) {
			console.error('Error adding to cart:', error);
			alert('Failed to add item to cart.');
		}
	};

	return (
		<button className='card bg-white w-full shadow-xl relative'>
			<figure className='relative h-[30vh] aspect-square overflow-hidden'>
				<Image
					src={typeof images === 'string' ? images : images[0]}
					alt='Product Image'
					layout='responsive'
					width={200}
					height={200}
					// fill
					className='object-cover hover:scale-105 duration-200'
				/>
			</figure>

			<div className='card-body w-full text-left lg:text-sm md:text-xs text-[8px] lg:p-4 md:p-2 p-1'>
				<h2 className='text-sm'>{name}</h2>
				<p>{formatCurrency(price)},-</p>
				<div className='badge badge-warning gap-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-4'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
						/>
					</svg>
					{storeName}
				</div>
				<div className='flex items-center'>
					<div className='txt-primary'>
						<PlaceIcon />
					</div>
					{address}
				</div>
				<div className='flex gap-3'>
					<button
						onClick={handleWishListStatus}
						className='active:scale-90 duration-200 text-red-600'>
						{wishListStatus ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</button>
					<button
						onClick={handleAddToCart}
						className='active:scale-90 duration-200 flex items-center bgr-primary p-2 rounded-xl text-white'>
						<ShoppingCartOutlinedIcon className='mr-1' /> Add to Cart
					</button>
				</div>
			</div>
		</button>
	);
};

export default CardItemStore;
