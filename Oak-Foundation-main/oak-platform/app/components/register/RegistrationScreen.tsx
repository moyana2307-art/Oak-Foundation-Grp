import Hero from "./Hero";
import Statistics from "./Statistics";
import RegistrationForm from "./RegistrationForm";
import Footer from "./Footer";

export default function RegistrationScreen() {
  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="flex flex-col gap-4 pb-2 pt-4">
        <Hero />
        <Statistics />
        <RegistrationForm />
        <Footer />
      </div>
    </main>
  );
}