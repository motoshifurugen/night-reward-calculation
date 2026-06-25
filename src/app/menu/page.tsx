import Navbar from "../utility/Navbar";
import PastMenuHistory from "./PastMenuHistory";
import TodayMenu from "./TodayMenu";
import UpcomingMenu from "./UpcomingMenu";
import MenuCalendar from "./MenuCalendar";
import Footer from "../utility/Footer";

export default function MenuPage() {
  return (
    <>
      <main className="pb-16">
        <Navbar variant="menu" />
        <PastMenuHistory />
        <TodayMenu />
        <UpcomingMenu />
        <MenuCalendar />
      </main>
      <Footer active="menu" />
    </>
  );
}
