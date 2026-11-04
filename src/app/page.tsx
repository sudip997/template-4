import { Hero } from "@/components/sections/hero/hero";
import { LogoCloud } from "@/components/sections/logo-cloud/logo-cloud";
import { Navbar } from "@/components/sections/navbar/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <LogoCloud />
      </main>
    </>
  );
}
