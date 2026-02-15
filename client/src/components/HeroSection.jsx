import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4
      bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">

      {/* soft glow layers */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 container-custom text-center space-y-8">
        <span className="inline-block px-4 py-1 rounded-full bg-white/15 backdrop-blur text-sm tracking-wide">
          ✨ AI-Powered Home Design
        </span>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Design Your Dream Home with{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            AI Intelligence
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          Get personalized home design recommendations based on your land size,
          budget, lifestyle, and Vastu preferences.
        </p>

        <div className="flex flex-wrap gap-6 justify-center pt-6">
          <Link
            to="/auth?role=user"
            className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-700 shadow-xl hover:bg-gray-100 transition"
          >
            Get Started
            <ArrowRight size={22} />
          </Link>

          <Link
            to="/auth?role=architect"
            className="rounded-xl border border-white/60 px-8 py-4 text-lg font-semibold backdrop-blur hover:bg-white hover:text-indigo-700 transition"
          >
            I’m an Architect
          </Link>
        </div>
      </div>
    </section>
  );
}
