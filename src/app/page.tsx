import Navbar from "./home/Navbar";
import TodayCalorie from "./home/TodayCalorie";
import WeeklyProceed from "./home/WeeklyProceed";
import Footer from "./Footer";

export default function Page() {
  return (
    <>
      <main className="pb-16">
        <Navbar />
        <TodayCalorie />
        <WeeklyProceed />
      </main>
      <Footer />
    </>
  );
}
