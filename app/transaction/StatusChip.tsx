import React from 'react';
import { statusPayment } from './transaction';
import { Box } from '@mui/material';

interface props {
	status: statusPayment;
}

const StatusChip: React.FC<props> = ({ status }) => {
	return (
		<Box
			className={`py-2 px-4 rounded-md w-fit font-bold border-2 ${
				status == 'SETTLEMENT' || status === 'PAID'
					? 'bg-lime-300 text-lime-700 border-lime-700'
					: status === 'UNPAID'
					? 'bg-yellow-300 text-yellow-700 border-yellow-700'
					: 'bg-rose-300 text-rose-700  border-rose-700'
			}`}>
			{status}
		</Box>
	);
};

export default StatusChip;
