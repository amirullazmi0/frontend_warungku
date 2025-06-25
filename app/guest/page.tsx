'use client';

import { usePathname } from 'next/navigation';
import MainPage from '../component/MainPage';
import Section from './Section';
import NavbarGuest from './NavbarGuest';
import FormNavProvider from '../component/context/FormNavContext';
export default function Home() {
	const pathName = usePathname();

	return (
		<main className='min-h-screen flex'>
			<FormNavProvider>
				<MainPage>
					<NavbarGuest />
					<Section />
				</MainPage>
			</FormNavProvider>
		</main>
	);
}
