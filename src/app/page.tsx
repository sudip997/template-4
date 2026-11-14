import { Features } from "@/components/sections/features/features";
import { Hero } from "@/components/sections/hero/hero";
import { LaunchFlow } from "@/components/sections/launch-flow/launch-flow";
import { LogoCloud } from "@/components/sections/logo-cloud/logo-cloud";
import { Navbar } from "@/components/sections/navbar/navbar";
import { Testimonials } from "@/components/sections/testimonials/testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <LogoCloud />
        <LaunchFlow />
        <Features />
        <Testimonials />
      </main>
    </>
  );
}
