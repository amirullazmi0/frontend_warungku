import Image from "next/image";
import Sidebar from "./component/Sidebar";
import SidebarItem from "./component/SidebarItem";
import MainPage from "./component/MainPage";
import Section from "./Section";
import Navbar from "./component/user/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex">
      <Sidebar>
        <SidebarItem />
      </Sidebar>
      <MainPage>
        <Navbar />
        <Section />
      </MainPage>
    </main>
  );
}
