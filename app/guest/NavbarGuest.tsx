'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { Checkbox, FormControl, FormControlLabel, InputAdornment, OutlinedInput, Stack, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { FormNavContext } from '../component/context/FormNavContext';
import { CategoryDTO } from '../DTO/itemStore';
import { GlobalsAxiosResponse } from '../DTO/GLobals';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import axios from 'axios';
import { Close, Tune } from '@mui/icons-material';

export default function NavbarGuest() {
	const navigation = useRouter();
	const router = useRouter();
	const pathname = usePathname();
	const API_URL = process.env.API_URL;
	const formNavContex = useContext(FormNavContext);
	const modalRef = useRef<HTMLDialogElement>(null);
	const [keyword, setKeyword] = useState<string | null>(null);
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
			} = await axios.get(`${API_URL}/guest/item-store/category`);

			if (response.data) {
				console.log('categor', response.data);
				setCategory(response.data.data);
			}
		} catch (error) {}
	};

	const handleFilter = async () => {
		try {
			formNavContex?.setCategory(categorySelect);
		} catch (error) {}
	};

	const handleKeyword = () => {
		formNavContex?.setKeyword(keyword);
	};

	useEffect(() => {
		getCategrory();
	}, []);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position='static'
				color='inherit'>
				<Toolbar
					sx={{
						width: '100%',
						justifyContent: 'space-between',
						display: {
							xs: 'grid',
							md: 'flex',
						},
						gap: 1,
						padding: 2,
					}}>
					<Stack flexDirection={'row'}>
						<div className='flex flex-row items-center space-x-2'>
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
												variant='contained'
												fullWidth
												onClick={() => {
													modalRef.current?.close();
													handleFilter();
												}}>
												Filter
											</Button>
										</div>
									</div>
								</div>
							</div>
						</dialog>
					</Stack>
					<Stack
						flexDirection={'row'}
						gap={1}>
						<Button
							variant='outlined'
							color='primary'
							onClick={() => navigation.push('/login/user-account')}>
							Login
						</Button>
						<Button
							color='warning'
							onClick={() => navigation.push('/register/user-account')}
							variant='contained'>
							Register
						</Button>
					</Stack>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
