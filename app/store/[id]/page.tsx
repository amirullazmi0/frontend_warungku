import Footer from '@/app/component/Footer';
import MainPage from '@/app/component/MainPage';
import Navbar from '@/app/component/user/Navbar';
import Section from './components/Section';

export default function Home() {
	return (
		<main className='min-h-screen flex'>
			{/* <Sidebar>
        <SidebarItem />
      </Sidebar> */}
			<MainPage>
				<Navbar />
				<Section />
				<Footer />
			</MainPage>
		</main>
	);
}
