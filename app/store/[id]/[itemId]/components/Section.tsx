'use client';
import { itemStore } from '@/app/DTO/itemStore';
import { Box, IconButton, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React, { use, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import defaultJpg from '@/public/default.webp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { formatCurrency } from '@/app/utils/formatCurrency';

const Section = () => {
	const storeId = useParams()['id'];
	const itemId = useParams()['itemId'];
	const [items, setItems] = useState<itemStore>();
	const [loading, setLoading] = useState<boolean>(true);

	const accessToken = Cookies.get('accessToken');

	const fetchItemStores = async () => {
		try {
			setLoading(true);

			const queryParams = new URLSearchParams();
			if (itemId) queryParams.append('id', itemId.toString());

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
				const data = response.data.data.item[0];
				setItems(data);
				setWishListStatus(data.wishlist);
			}
		} catch (error: any) {
			console.error('Failed to fetch item stores:', error.response?.data || error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchItemStores();
	}, []);

	const [activeIndex, setActiveIndex] = useState(0);
	const carouselRef = useRef<HTMLDivElement>(null); // ✅ Expli

	useEffect(() => {
		const handleScroll = () => {
			if (!carouselRef.current) return;

			const slides = carouselRef.current.children;
			let currentIndex = 0;
			let minOffset = Infinity;

			for (let i = 0; i < slides.length; i++) {
				const rect = slides[i].getBoundingClientRect();
				const offset = Math.abs(rect.left - carouselRef.current.getBoundingClientRect().left);

				if (offset < minOffset) {
					minOffset = offset;
					currentIndex = i;
				}
			}

			setActiveIndex(currentIndex);
		};

		const carouselElement = carouselRef.current;
		if (carouselElement) {
			carouselElement.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (carouselElement) {
				carouselElement.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);

	const [wishListStatus, setWishListStatus] = useState<boolean>(false);

	const handleWishListStatus = () => {
		updateWishlist();
		setWishListStatus(prev => !prev);
	};

	const route = useRouter();

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

	if (loading) {
		return (
			<section>
				<div className='p-5 text-center'>Loading items...</div>;
			</section>
		);
	}

	return (
		<section>
			<Stack
				justifyContent={'center'}
				alignItems='center'>
				<Box
					className='shadow-md lg:w-[60%] flex flex-col items-center p-10 gap-5 bg-white'
					sx={{
						padding: 2,
						borderRadius: 3,
					}}>
					<Box className='relative'>
						{/* Carousel */}
						<div
							ref={carouselRef}
							className='carousel w-full aspect-video'>
							{items &&
								items.itemStorageImage.length > 0 &&
								items?.itemStorageImage.map((image, index) => (
									<div
										key={index}
										id={`item${index}`}
										className='carousel-item w-full rounded-xl overflow-hidden flex justify-center'>
										<img
											src={image.path ?? ''}
											className='h-full object-cover'
											alt={`Image ${index}`}
										/>
									</div>
								))}
						</div>

						{/* Thumbnail Navigation with Black Transparent Background */}
						<div className='w-full flex rounded-md mt-2'>
							{items &&
								items.itemStorageImage.length > 0 &&
								items?.itemStorageImage.map((image, index) => (
									<a
										key={index}
										href={`#item${index}`}
										className={`w-[10%] p-1 rounded-md ${activeIndex === index ? 'border-2 border-white opacity-100' : 'opacity-50'}`}
										onClick={() => setActiveIndex(index)}>
										<img
											alt=''
											src={image.path || defaultJpg.src}
											className='object-cover rounded-md w-full'
										/>
									</a>
								))}
						</div>
					</Box>

					<Box className='grid lg:md:grid-cols-4 w-full gap-4'>
						<>
							<div className=''>Nama Barang : </div>
							<div className='lg:md:col-span-3 text-lg font-bold'>{items?.name}</div>
						</>
						<>
							<div className=''>Harga : </div>
							<div className='lg:md:col-span-3'>{formatCurrency(items?.price ?? 0)}</div>
						</>
						<>
							<div className=''>Deskripsi : </div>
							<div className='lg:md:col-span-3'>{items?.desc}</div>
						</>
					</Box>
					<Stack
						flexDirection={'row'}
						width={'100%'}
						gap={2}
						justifyContent={'flex-end'}>
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
					</Stack>
				</Box>
			</Stack>
		</section>
	);
};

export default Section;
