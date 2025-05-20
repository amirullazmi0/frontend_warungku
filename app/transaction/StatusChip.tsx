import React from 'react';
import { statusPayment } from './transaction';
import { Box } from '@mui/material';

interface props {
	status: statusPayment;
}

const StatusChip: React.FC<props> = ({ status }) => {
	return (
		<Box
			className={`py-2 px-4 rounded-md w-fit font-bold ${status == 'SETTLEMENT' ? 'text-warning' : status === 'UNPAID' ? 'text-error' : status === 'PAID' ? 'text-success' : 'text-error'}
			}`}>
			{status == 'SETTLEMENT' ? 'Belum Dibayar' : status === 'UNPAID' ? 'Belum Dibayar' : status === 'PAID' ? 'Lunas' : 'Dibatalkan'}
		</Box>
	);
};

export default StatusChip;
