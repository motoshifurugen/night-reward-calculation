import Navbar from "./utility/Navbar";
import TodayCalorie from "./home/TodayCalorie";
import WeeklyMenu from "./home/WeeklyMenu";
import WeeklyProgress from "./home/WeeklyProgress";
import MonthCalendar from "./home/MonthCalendar";
import Footer from "./utility/Footer";

export default function HomePage() {
  return (
    <>
      <main className="pb-16">
        <Navbar variant="home" />
        <TodayCalorie />
        <WeeklyProgress />
        <WeeklyMenu />
        <MonthCalendar />
      </main>
      <Footer />
    </>
  );
}
