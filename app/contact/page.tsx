import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SimpleProfileCard from "@/components/SimpleProfileCard";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 text-neutral-100 pt-28 pb-20">
        <div className="container-p">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Contact</h1>
            <p className="text-lg opacity-80">
              Reach out directly via email or LinkedIn for collaboration, consulting or full-stack development.
            </p>
          </div>

          {/* Contact the Founder */}
          <div className="max-w-lg mx-auto mb-16">
            <div className="flex flex-col justify-between items-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-white/10 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
              <div className="w-full">
                <h2 className="text-2xl font-semibold mb-6 text-center">Contact the Founder</h2>
                <div className="w-full max-w-sm mx-auto">
                  <SimpleProfileCard
                    name="Martin Andreassen"
                    role="Founder & CTO — Andreassen Technology"
                    imageSrc="/CTOaTech.png"
                    accent="cyan"
                    intensity={0.25}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <a 
                  href="https://www.linkedin.com/in/martin-andreassen-895b2a290/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 hover:bg-white/20 p-3 ring-1 ring-white/10 transition"
                  aria-label="LinkedIn Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:post@andreassentech.no"
                  className="rounded-full bg-white/10 hover:bg-white/20 p-3 ring-1 ring-white/10 transition"
                  aria-label="Send Email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm opacity-70 space-y-2">
            <p>
              Email: <a href="mailto:post@andreassentech.no" className="hover:underline text-cyan-400/80">post@andreassentech.no</a>
            </p>
            <p>Bergen, Norway</p>
            <p>Mon–Fri, 09:00–17:00</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
