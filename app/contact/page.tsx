"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SimpleProfileCard from "@/components/SimpleProfileCard";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset status
    setSuccess(false);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        // Success: clear fields and show success message
        setName("");
        setEmail("");
        setMessage("");
        setSuccess(true);
        setError(null);
      } else {
        // Error response
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        setSuccess(false);
      }
    } catch (err) {
      // Network or other error
      setError("Something went wrong. Please try again.");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 text-neutral-100 pt-28 pb-20">
        <div className="container-p">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Contact</h1>
            <p className="text-lg opacity-80">
              We&apos;d love to hear about your project. Whether you&apos;re looking for collaboration, consulting, or full-stack development, reach out below.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch mb-16">
            {/* Contact Form */}
            <form onSubmit={onSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-white/10 shadow-[0_0_20px_rgba(56,189,248,0.15)] flex flex-col justify-between h-full">
              <div className="space-y-4">
                <input 
                  type="text"
                  name="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name" 
                  required 
                  disabled={isLoading}
                  className="w-full rounded-lg bg-neutral-900/80 px-4 py-3 border border-white/10 focus:ring-2 focus:ring-cyan-400/50 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input 
                  type="email" 
                  name="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email" 
                  required 
                  disabled={isLoading}
                  className="w-full rounded-lg bg-neutral-900/80 px-4 py-3 border border-white/10 focus:ring-2 focus:ring-cyan-400/50 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <textarea 
                  name="message" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message" 
                  rows={6} 
                  required 
                  disabled={isLoading}
                  className="w-full rounded-lg bg-neutral-900/80 px-4 py-3 border border-white/10 focus:ring-2 focus:ring-cyan-400/50 outline-none transition resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/30 hover:bg-cyan-500/20 transition-all py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
                {success && (
                  <p className="text-sm text-center text-cyan-400 mt-2">
                    Message sent ✓
                  </p>
                )}
                {error && (
                  <p className="text-sm text-center text-red-400 mt-2">
                    {error}
                  </p>
                )}
              </div>
            </form>

            {/* Contact the Founder */}
            <div className="flex flex-col justify-between items-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-white/10 shadow-[0_0_20px_rgba(56,189,248,0.15)] h-full">
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
                  href="mailto:hello@andreassentechnology.no"
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
              Email: <a href="mailto:hello@andreassentechnology.no" className="hover:underline text-cyan-400/80">hello@andreassentechnology.no</a>
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

