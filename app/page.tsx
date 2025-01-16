import MainPage from './component/MainPage';
import Section from './Section';
import Navbar from './component/user/Navbar';
import Head from 'next/head';

export default function Home() {
  return (
    <main className="min-h-screen flex">
      <MainPage>
        <Navbar />
        <Section />
      </MainPage>
    </main>
  );
}
