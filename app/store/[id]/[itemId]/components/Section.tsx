'use client';
import { Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';

const Section = () => {
	const id = useParams()['id'];
	return (
		<section>
			<Stack>{id}</Stack>
		</section>
	);
};

export default Section;
