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
import { set, useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Alert } from '@mui/material';

interface Props {
	images: string | string[];
	name: string;
	price: number;
	address: string;
	itemId: string;
	storeId: string;
	storeName: string;
}

const CardItemStoreGuest: React.FC<Props> = ({ images, name, price, address, itemId, storeId, storeName }) => {
	const route = useRouter();
	const [errorStatus, setErrorStatus] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const handleWishListStatus = async () => {
		setErrorMessage('Tidak dapat menambahkan ke wishlist, anda harus login terlebih dahulu.');
		setErrorStatus(true);
		setTimeout(() => {
			route.push('/login/user-account');
			setErrorStatus(false);
		}, 3000);
	};

	const handleAddToCart = async () => {
		setErrorMessage('Tidak dapat menambahkan ke keranjang, anda harus login terlebih dahulu.');
		setErrorStatus(true);
		setTimeout(() => {
			route.push('/login/user-account');
			setErrorStatus(false);
		}, 3000);
	};

	return (
		<div className='card bg-white shadow-xl relative overflow-hidden'>
			{errorStatus && (
				<div className='mb-4 absolute z-30 p-5'>
					<Alert
						severity='error'
						className='capitalize rounded-lg'>
						{errorMessage}
					</Alert>
				</div>
			)}
			<button
				onClick={() => route.push(`/store/${storeId}/${itemId}`)}
				className='relative w-full aspect-square overflow-hidden'>
				<Image
					src={typeof images === 'string' ? images : images[0]}
					alt='Product Image'
					// layout='responsive'
					// width={200}
					// height={200}
					fill
					className='object-cover hover:scale-105 duration-200 w-full'
				/>
			</button>

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
					<div className='lg:text-sm md:text-xs text-[8px]'>{storeName}</div>
				</div>
				<div className='flex items-center'>
					<div className='txt-primary'>
						<PlaceIcon />
					</div>
					{address}
				</div>
				<div className='flex gap-3'>
					<button
						onClick={() => handleWishListStatus()}
						className='active:scale-90 duration-200 text-red-600'>
						<FavoriteBorderIcon />
					</button>
					<button
						onClick={handleAddToCart}
						className='active:scale-90 duration-200 flex items-center bgr-primary p-2 rounded-xl text-white'>
						<ShoppingCartOutlinedIcon className='mr-1' /> Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default CardItemStoreGuest;
