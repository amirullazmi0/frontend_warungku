import { Stack, Typography } from '@mui/material';
import React from 'react';

const Section = () => {
	return (
		<Stack
			p={1}
			direction={'row'}
			justifyContent={'center'}>
			<Stack
				p={2}
				sx={{
					width: {
						lg: '60%',
						md: '80%',
						xs: '100%',
					},
					bgcolor: 'white',
					borderRadius: 2,
				}}>
				<Typography variant='h5'>Your Transaction</Typography>
			</Stack>
		</Stack>
	);
};

export default Section;
