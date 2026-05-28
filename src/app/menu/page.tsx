import MenuHeader from "./MenuHeader";
import PastMenuHistory from "./PastMenuHistory";
import TodayMenu from "../home/TodayMenu";
import Footer from "../Footer";

export default function MenuPage() {
  return (
    <>
      <main className="pb-16">
        <MenuHeader />
        <PastMenuHistory />
        <TodayMenu />
      </main>
      <Footer active="menu" />
    </>
  );
}
