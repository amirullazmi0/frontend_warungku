'use client';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import Tron from '../component/user/Tron';
import { userDTO } from '@/model/user.model';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Alert, Button, Divider, Skeleton, TextField } from '@mui/material';
import FormUpdateAddress from '../component/user/FormUpdateAddress';
import { useRouter } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import avatarPng from '@/public/avatar.png';
import CircularProgress from '@mui/material/CircularProgress';

const Section = () => {
	const [profile, setProfile] = useState<userDTO | undefined>(undefined);
	const [updateProfileSuccess, setUpdateProfileSuccess] = useState<boolean | undefined>(undefined);
	const [isSaving, setIsSaving] = useState(false);
	const [avatar, setAvatar] = useState<string | StaticImageData>();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const API_URL = process.env.API_URL;
	const router = useRouter();
	const accessToken = Cookies.get('accessToken');

	useEffect(() => {
		getProfile();
	}, []);

	const getProfile = async () => {
		try {
			const response = await axios.get(`${API_URL}/api/user/profile`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (response.data.success) {
				setProfile(response.data.data);
				// Set avatar dari profile jika ada
				if (response.data.data.images) {
					setAvatar(response.data.data.images);
				}
			}
		} catch (error) {
			// error handling bisa ditambah
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setProfile(prevProfile => ({
			...prevProfile,
			[name]: value,
		}));
	};

	const handleUpdateProfile = async () => {
		if (!profile) return;

		try {
			const formData = new FormData();
			formData.append('email', profile.email || '');
			formData.append('fullName', profile.fullName || '');
			formData.append('address', profile.addressId || '');

			// Jika avatar sudah diganti dan bertipe File, tambahkan ke formData
			if (selectedFile) {
				formData.append('avatar', selectedFile);
			}

			const response = await axios.put(`${API_URL}/api/user/update/profile`, formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response.data.success) {
				setUpdateProfileSuccess(true);
				setTimeout(() => setUpdateProfileSuccess(undefined), 5000);
				// Reload profile utk update tampilan
				getProfile();
			}
		} catch (error) {
			// error handling bisa ditambah
		}
	};

	// Untuk simpan file avatar baru
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Optional: validasi tipe dan ukuran file
		if (!file.type.startsWith('image/')) {
			alert('File harus berupa gambar!');
			return;
		}

		setSelectedFile(file);
		const imageUrl = URL.createObjectURL(file);
		setAvatar(imageUrl);
	};

	const handleSave = async () => {
		if (!selectedFile) return;

		try {
			setIsSaving(true); // mulai loading

			const formData = new FormData();
			formData.append('images', selectedFile);

			const response = await axios.put(`${API_URL}/api/user/update/profile`, formData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response.data.success) {
				setUpdateProfileSuccess(true);
				setTimeout(() => setUpdateProfileSuccess(undefined), 5000);
			}

			await getProfile();
			setSelectedFile(null);
		} catch (error) {
			// bisa tampilkan alert error di sini
		} finally {
			setIsSaving(false); // selesai loading
		}
	};

	return (
		<section className='flex justify-center'>
			<div className='lg:w-[70%] w-full flex flex-col gap-2'>
				<div className='w-[100%]'>
					<Tron />
				</div>
				<div className='lg:md:flex grid gap-2'>
					<div className='lg:md:w-[70%] w-full'>
						<div className='card bg-white'>
							<div className='card-body'>
								<button
									onClick={() => router.push('/transaction')}
									className='button w-fit aspect-square p-5 rounded-md overflow-hidden shadow-lg gap-4'>
									<div className=''>
										<PaymentsOutlinedIcon />
									</div>
									Transaksi
								</button>
								{updateProfileSuccess && (
									<div className='mt-3 fixed top-32 right-3 z-50'>
										<Alert
											className='shadow-lg'
											severity='success'>
											Data profil berhasil diperbarui
										</Alert>
									</div>
								)}
								<div className='flex flex-col gap-4 mt-5'>
									<div className='grid lg:md:grid-cols-10 items-start'>
										<div className='lg:md:col-span-2'>Email</div>
										<div className='lg:md:block hidden col-span-1'>:</div>
										<div className='lg:md:col-span-7'>
											{profile ? (
												<TextField
													name='email'
													onChange={handleChange}
													id='outlined-basic'
													className='w-full'
													value={profile.email || ''}
													variant='outlined'
												/>
											) : (
												<Skeleton
													variant='text'
													sx={{ fontSize: '1rem' }}
												/>
											)}
										</div>
									</div>
									<div className='grid lg:md:grid-cols-10 items-start'>
										<div className='lg:md:col-span-2'>Nama Lengkap</div>
										<div className='lg:md:block hidden col-span-1'>:</div>
										<div className='lg:md:col-span-7'>
											{profile ? (
												<TextField
													name='fullName'
													onChange={handleChange}
													id='outlined-basic'
													className='w-full'
													value={profile.fullName || ''}
													variant='outlined'
												/>
											) : (
												<Skeleton
													variant='text'
													sx={{ fontSize: '1rem' }}
												/>
											)}
										</div>
									</div>

									<Button
										onClick={handleUpdateProfile}
										variant='contained'
										disableElevation>
										SIMPAN
									</Button>
								</div>
								<FormUpdateAddress />
							</div>
						</div>
					</div>
					<div className='lg:md:w-[30%] relative'>
						<div
							className='card bg-white cursor-pointer relative p-5'
							onClick={handleAvatarClick}>
							<div className='bg-white rounded-full flex justify-center items-center relative aspect-square overflow-hidden p-2'>
								<Image
									src={avatar ?? avatarPng}
									alt='Profile'
									fill
								/>
								<span className='absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded cursor-pointer select-none'>Edit Avatar</span>
							</div>
						</div>
						<input
							type='file'
							accept='image/*'
							ref={fileInputRef}
							onChange={handleFileChange}
							style={{ display: 'none' }}
						/>
						{selectedFile && (
							<Button
								onClick={handleSave}
								variant='contained'
								className='mt-2 w-full'>
								{isSaving ? (
									<CircularProgress
										color='inherit'
										size={24}
									/>
								) : (
									<span>Perbarui Avatar</span>
								)}
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section;
