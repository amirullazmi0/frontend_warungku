import Image from "next/image";
import Section from "./Section";
import type { Metadata } from 'next'
import Sidebar from "../component/Sidebar";
import SidebarItem from "../component/SidebarItem";
import MainPage from "../component/MainPage";
import Navbar from "../component/user/Navbar";

export const metadata: Metadata = {
    title: 'Halaman Login'
}
export default function Home() {
    return (
        <main className="min-h-screen w-screen flex">
            <Sidebar>
                <SidebarItem />
            </Sidebar>
            <MainPage>
                <Navbar />
                {/* <Section /> */}
            </MainPage>
        </main>
    );
}
