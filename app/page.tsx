'use client';
import MainPage from './component/MainPage';
import Section from './Section';
import Navbar from './component/user/Navbar';
import FormNavProvider from './component/context/FormNavContext';
import { usePathname } from 'next/navigation';
import Footer from './component/Footer';

export default function Home() {
	const pathName = usePathname();

	return (
		<main className='min-h-screen flex'>
			<MainPage>
				<FormNavProvider>
					<Navbar />
					<Section />
					<Footer />
				</FormNavProvider>
			</MainPage>
		</main>
	);
}
