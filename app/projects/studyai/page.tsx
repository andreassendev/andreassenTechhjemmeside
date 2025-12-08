import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StudyAI() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 text-neutral-100 pt-28 pb-20">
        <div className="container-p max-w-4xl mx-auto">
          <a 
            href="/projects" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-8"
          >
            ← Back to Projects
          </a>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-white/10 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
            <h1 className="text-4xl font-bold mb-6">StudyAI</h1>
            <p className="text-lg text-white/80 mb-6">
              AI-driven study product — currently in development
            </p>
            
            <div className="space-y-4 text-white/70">
              <p>This innovative study tool is currently in development. Check back soon for updates!</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

