import MainPage from '../component/MainPage';
import Navbar from '../component/user/Navbar';
import Section from './Section';

export default function Home() {
	return (
		<main className='min-h-screen flex'>
			{/* <Sidebar>
        <SidebarItem />
      </Sidebar> */}
			<MainPage>
				<Navbar />
				<Section />
			</MainPage>
		</main>
	);
}