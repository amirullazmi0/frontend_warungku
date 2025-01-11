import type { Metadata } from 'next';
import MainPage from '../component/MainPage';
import Navbar from '../component/user/Navbar';
import CartPage from './Cart';

export const metadata: Metadata = {
  title: 'Halaman Profil',
};
export default function Home() {
  return (
    <main className="min-h-screen max-w-screen flex">
      <MainPage>
        <Navbar />
        <CartPage />
      </MainPage>
    </main>
  );
}
