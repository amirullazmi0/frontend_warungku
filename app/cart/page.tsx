import type { Metadata } from 'next';
import MainPage from '../component/MainPage';
import Navbar from '../component/user/Navbar';
import CartPage from './Cart';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Halaman Profil',
};
export default function Home() {
  return (
    <main className="min-h-screen max-w-screen flex">
      <MainPage>
        <Navbar />
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="SB-Mid-client-g7DzPGpxRHrj04Vn"
          strategy="afterInteractive"
        ></Script>
        <CartPage />
      </MainPage>
    </main>
  );
}
