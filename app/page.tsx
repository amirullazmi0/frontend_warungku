'use client';
import MainPage from './component/MainPage';
import Section from './Section';
import Navbar from './component/user/Navbar';
import { FormProvider, useForm } from 'react-hook-form';
import { keywordFilterSchema } from './component/config/config-keyword';
import { yupResolver } from '@hookform/resolvers/yup';
import FormNavProvider from './component/context/FormNavContext';

export default function Home() {
	const form = useForm({
		resolver: yupResolver(keywordFilterSchema),
		mode: 'onChange',
	});

	return (
		<main className='min-h-screen flex'>
			<MainPage>
				<FormNavProvider>
					<Navbar />
					<Section />
				</FormNavProvider>
			</MainPage>
		</main>
	);
}
