import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrueFocus from "@/components/TrueFocus";
import DecryptedText from "@/components/DecryptedText";
import DarkVeil from "@/components/DarkVeil";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative pt-28">
        {/* HERO */}
        <section className="relative h-[70vh] min-h-[560px] overflow-hidden">
          {/* Bakgrunn: DarkVeil */}
          <div className="absolute inset-0 -z-10">
            <DarkVeil className="rounded-none" />
            {/* Diskré gradient for kontrast mot tekst */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Innhold */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center container-p">
            <TrueFocus sentence="Andreassen Technology" className="mb-6" />
            <DecryptedText
              text="Beware of our software."
              animateOn="view"
              className="font-medium"
              parentClassName="text-lg md:text-xl text-white/80"
            />
            <div className="mt-10 flex gap-3">
              <a href="/projects" className="glass px-5 py-3 rounded-xl hover:bg-white/10 transition">View Projects</a>
              <a href="/contact" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10">Contact</a>
            </div>
          </div>
        </section>

        <section className="container-p mt-20 grid gap-6 md:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">What we do</h3>
            <p className="text-white/70">We build modern websites, landing pages and web apps, with a focus on web design and app development.</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">How we work</h3>
            <p className="text-white/70">Clean, scalable and efficient code.</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2">Tech</h3>
            <p className="text-white/70">React, Next.js, TypeScript, Node.js, Postgres/Supabase, Tailwind CSS, and modern app tooling.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

