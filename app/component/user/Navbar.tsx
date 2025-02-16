'use client';
import { Home, Logout, Person, Tune, Close } from '@mui/icons-material';
import { Avatar, Box, Button, Checkbox, Divider, FormControl, FormControlLabel, IconButton, InputAdornment, ListItemIcon, Menu, MenuItem, OutlinedInput, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { userDTO } from '@/model/user.model';
import axios from 'axios';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { CategoryDTO } from '@/app/DTO/itemStore';
import { GlobalsAxiosResponse } from '@/app/DTO/GLobals';
import { FormNavContext } from '../context/FormNavContext';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
const Navbar = () => {
	const router = useRouter();

	const pathname = usePathname();

	const [profile, setProfile] = useState<userDTO>({});
	const [keyword, setKeyword] = useState<string | null>(null);
	const API_URL = process.env.API_URL;
	const accessToken = Cookies.get('accessToken');
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		Cookies.remove('accessToken');
		router.push('/login/user-account');
		handleClose();
	};

	const handleNavigation = (e: string) => {
		router.push(e);
	};

	const modalRef = useRef<HTMLDialogElement>(null);
	const [category, setCategory] = useState<CategoryDTO[]>();
	const [categorySelect, setCategorySelect] = useState<string[]>([]);

	const handleOnChangeCategorySelect = (categoryId: string) => {
		setCategorySelect(prev => {
			if (!prev) return [categoryId];
			if (prev.includes(categoryId)) {
				return prev.filter(id => id !== categoryId);
			} else {
				return [...prev, categoryId];
			}
		});
	};

	const getCategrory = async () => {
		try {
			const response: {
				data: GlobalsAxiosResponse<CategoryDTO[]>;
			} = await axios.get(`${API_URL}/api/user/item-store/category`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (response.data) {
				setCategory(response.data.data);
			}
		} catch (error) {}
	};

	const handleFilter = async () => {
		try {
			formNavContex?.setCategory(categorySelect);
		} catch (error) {}
	};

	const getProfile = async () => {
		try {
			const response = await axios.get(`${API_URL}/api/user/profile`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (response.data.success) {
				setProfile(response.data.data);
			} else {
				router.push('/login/user-account');
			}
		} catch (error) {
			router.push('/login/user-account');
		}
	};

	const formNavContex = useContext(FormNavContext);

	const handleKeyword = () => {
		formNavContex?.setKeyword(keyword);
	};

	useEffect(() => {
		getProfile();
		if (pathname === '/') {
			getCategrory();
		}
	}, []);
	return (
		<div className='p-4 bg-white flex lg:md:flex-row flex-col-reverse justify-between items-center sticky top-0 z-10 shadow'>
			<div className='flex flex-col lg:md:w-[30%] w-full'>
				{pathname === '/' ? (
					<>
						<div className='flex flex-wrap text-white p-1 bgr-primary mb-1 rounded w-fit'>Cari Barang Mu</div>
						<div className='flex flex-row items-center space-x-2 w-full'>
							<FormControl variant='outlined'>
								<OutlinedInput
									id='outlined-adornment-weight'
									sx={{ height: '40px', flexGrow: 1 }}
									onChange={e => setKeyword(e.target.value)}
									placeholder='Cari di WarungKu'
									endAdornment={
										<InputAdornment position='end'>
											<SearchIcon />
										</InputAdornment>
									}
									aria-describedby='outlined-weight-helper-text'
									inputProps={{
										'aria-label': 'search',
									}}
								/>
							</FormControl>
							<Button
								className='w-fit'
								onClick={handleKeyword}
								disableElevation
								variant='contained'>
								Cari
							</Button>
							<Button
								variant='contained'
								disableElevation
								color='inherit'
								className='flex gap-4 w-fit'
								onClick={() => {
									// formNavContex?.setKeyword('');
									modalRef.current?.showModal();
								}} // ✅ Directly calls showModal()
							>
								Filter
								<Tune />
							</Button>
						</div>
					</>
				) : (
					<>
						<Button
							onClick={() => router.push('/')}
							className='flex flex-wrap text-white p-4 bgr-primary mb-1 rounded w-fit'
							sx={{}}>
							<ShoppingBagIcon fontSize='large' />
						</Button>
					</>
				)}
			</div>
			{/* Open the modal using document.getElementById('ID').showModal() method */}

			<dialog
				ref={modalRef}
				id='my_modal_4'
				className='modal modal-bottom sm:modal-middle p-4'>
				<div className='modal-box bg-white '>
					<div className='modal-action flex flex-col'>
						<div className='grid lg:md:grid-cols-3'>
							<form
								method='dialog'
								className='lg:md:col-span-3 flex justify-between items-center mb-5'>
								<div className=''>
									<Typography>Filter Item</Typography>
								</div>
								<button className='button button-warning p-1 rounded-full aspect-square'>
									<Close />
								</button>
							</form>
							{category?.map((item, index) => {
								return (
									<FormControlLabel
										key={index}
										control={
											<Checkbox
												name={item.id}
												checked={categorySelect.includes(item.id)}
												onChange={() => handleOnChangeCategorySelect(item.id)}
											/>
										}
										label={<Typography fontSize={'0.6rem'}>{item.name}</Typography>}
									/>
								);
							})}
							<div className='lg:md:col-span-3 '>
								<Button
									onClick={() => {
										modalRef.current?.close();
										handleFilter();
									}}
									className='bgr-primary text-white w-full mt-5'>
									Filter
								</Button>
							</div>
						</div>
					</div>
				</div>
			</dialog>

			<div className='flex justify-end items-center'>
				<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
					<Tooltip title='Home'>
						<IconButton
							onClick={() => handleNavigation('/')}
							size='small'
							sx={{ ml: 0 }}
							aria-haspopup='true'
							className='btn-circle overflow-hidden txt-primary'
							aria-expanded={open ? 'true' : undefined}>
							<HomeOutlinedIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
					<Tooltip title='Store'>
						<IconButton
							onClick={() => handleNavigation('/store')}
							size='small'
							sx={{ ml: 0 }}
							aria-haspopup='true'
							className='btn-circle overflow-hidden txt-primary'
							aria-expanded={open ? 'true' : undefined}>
							<StoreMallDirectoryOutlinedIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
					<Tooltip title='Wishlist'>
						<IconButton
							onClick={() => handleNavigation('/wishlist')}
							size='small'
							sx={{ ml: 0 }}
							aria-haspopup='true'
							className='btn-circle overflow-hidden txt-primary'
							aria-expanded={open ? 'true' : undefined}>
							<FavoriteBorderOutlinedIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
					<Tooltip title='Cart'>
						<IconButton
							size='small'
							sx={{ ml: 0 }}
							aria-haspopup='true'
							className='btn-circle overflow-hidden txt-primary'
							aria-expanded={open ? 'true' : undefined}
							onClick={() => handleNavigation('/cart')}>
							<LocalGroceryStoreOutlinedIcon />
						</IconButton>
					</Tooltip>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
					<Tooltip title='Account settings'>
						<IconButton
							onClick={handleClick}
							size='small'
							sx={{ ml: 0 }}
							aria-controls={open ? 'account-menu' : undefined}
							aria-haspopup='true'
							className='btn-circle overflow-hidden txt-primary'
							aria-expanded={open ? 'true' : undefined}>
							{profile.images ? (
								<Avatar
									alt=''
									src={profile.images}
								/>
							) : (
								<Avatar sx={{ width: 32, height: 32 }} />
							)}
						</IconButton>
					</Tooltip>
				</Box>
				<Menu
					anchorEl={anchorEl}
					id='account-menu'
					open={open}
					onClose={handleClose}
					onClick={handleClose}
					PaperProps={{
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.05))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
					<MenuItem onClick={() => handleNavigation(`/`)}>
						<ListItemIcon>
							<Home fontSize='small' />
						</ListItemIcon>
						Dashboard
					</MenuItem>
					<MenuItem onClick={() => handleNavigation(`${profile.rolesName === 'super' ? '/super/profile' : '/user'}`)}>
						<ListItemIcon>
							<Person fontSize='small' />
						</ListItemIcon>
						{profile.fullName}
					</MenuItem>
					<MenuItem onClick={handleLogout}>
						<ListItemIcon>
							<Logout fontSize='small' />
						</ListItemIcon>
						Logout
					</MenuItem>
				</Menu>
			</div>
		</div>
	);
};

export default Navbar;
