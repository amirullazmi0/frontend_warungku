'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import Tron from '../component/user/Tron';
import { userDTO } from '@/model/user.model';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Alert, Button, Divider, Skeleton, TextField } from '@mui/material';
import FormUpdateAddress from '../component/user/FormUpdateAddress';
import { useRouter } from 'next/navigation';

const Section = () => {
	const [profile, setProfile] = useState<userDTO | undefined>(undefined);
	const [updateProfileSuccess, setUpdateProfileSuccess] = useState<boolean | undefined>(undefined);
	const API_URL = process.env.API_URL;
	const router = useRouter();
	const accessToken = Cookies.get('accessToken');

	const getProfile = async () => {
		try {
			try {
				const response = await axios.get(`${API_URL}/api/user/profile`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (response.data.success) {
					setProfile(response.data.data);
				}
			} catch (error) {}
		} catch (error) {}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setProfile(prevProfile => ({
			...prevProfile,
			[name]: value,
		}));
	};

	const handleUpdateProfile = async () => {
		if (profile) {
			try {
				const formData = new FormData();
				formData.append('email', `${profile?.email}`);
				formData.append('fullName', `${profile?.fullName}`);
				formData.append('address', `${profile?.addressId}`);
				const response = await axios.put(`${API_URL}/api/user/update/profile`, formData, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (response.data.success) {
					setUpdateProfileSuccess(true);
					setTimeout(() => {
						setUpdateProfileSuccess(undefined);
					}, 5000);
				}
			} catch (error) {}
		}
	};

	useEffect(() => {
		getProfile();
	}, []);

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
									className='button w-fit'>
									<div className='card bg-white shadow lg:md:w-44 text-center overflow-hidden'>
										<div className='card-body'>
											<div className=''>
												<PaymentsOutlinedIcon />
											</div>
											Transaksi
										</div>
									</div>
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
													value={profile?.email}
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
													value={profile?.fullName}
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
					<div className='lg:md:w-[30%]'>
						<div className='card bgr-primary'>
							<div className='card-body flex flex-row justify-center'></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section;
