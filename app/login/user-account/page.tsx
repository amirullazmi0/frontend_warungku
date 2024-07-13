import Image from "next/image";
import Section from "./Section";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Halaman Login'
}
export default function Home() {
    return (
        <main className="min-h-screen">
            <Section />
        </main>
    );
}
