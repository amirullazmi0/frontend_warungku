import Image from 'next/image';
import React from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import defaultJpg from '@/public/default.webp';

interface Props {
	image: string;
	name: string;
	kecamatan: string;
	kota: string;
}
const CardStore = (props: Props) => {
	return (
		<div className='card shadow-md bg-white'>
			<figure className='relative w-full aspect-square overflow-hidden p-4'>
				<Image
					alt={props.image ?? ''}
					src={props.image ?? defaultJpg}
					fill
					className='object-cover hover:scale-105 duration-200 w-full'
				/>
			</figure>
			<div className='card-body w-full text-left lg:text-sm md:text-xs text-[8px] lg:p-4 md:p-2 p-1'>
				<div className='flex items-center gap-2 badge badge-warning'>
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
					<div className='lg:text-md md:text-sm text-[10px]'>{props.name}</div>
				</div>
				<div className='flex items-center'>
					<div className='txt-primary'>
						<PlaceIcon />
					</div>
					<div className='lg:text-xs md:text-xs text-[10px]'>
						{props.kecamatan} {props.kota && `, ${props.kota}`}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardStore;
