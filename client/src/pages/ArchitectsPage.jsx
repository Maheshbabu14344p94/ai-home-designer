import React from "react";
import { Mail, Building2, Landmark } from "lucide-react";

const architectRoles = [
  {
    title: "What architects do",
    points: [
      "Plan safe, functional, and beautiful homes.",
      "Convert your ideas into practical floor plans.",
      "Optimize space, ventilation, and natural light.",
      "Coordinate with structural, electrical, and plumbing teams.",
    ],
    icon: Building2,
  },
  {
    title: "Why we consider architects",
    points: [
      "Avoid costly design mistakes during construction.",
      "Improve resale value with better planning.",
      "Ensure code compliance and build quality.",
      "Balance budget, aesthetics, and long-term durability.",
    ],
    icon: Landmark,
  },
];

const worldClassArchitects = [
  {
    name: "Norman Foster",
    firm: "Foster + Partners",
    email: "contact@fosterandpartners.com",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80&auto=format&fit=crop",
    contribution:
      "Known for sustainable and high-tech architecture across global city landmarks.",
  },
  {
    name: "Bjarke Ingels",
    firm: "BIG (Bjarke Ingels Group)",
    email: "info@big.dk",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
    contribution:
      "Popular for innovative, people-first urban and residential design ideas.",
  },
  {
    name: "Zaha Hadid (Legacy)",
    firm: "Zaha Hadid Architects",
    email: "info@zaha-hadid.com",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop",
    contribution:
      "Inspired the world with fluid forms and futuristic design language.",
  },
];

export default function ArchitectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-3xl font-bold">Architects & Their Contribution</h1>
        <p className="mt-2 text-white/90">
          Learn why architects matter and explore world-class professionals.
        </p>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        {architectRoles.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="text-indigo-600" size={22} />
                <h2 className="text-xl font-semibold">{item.title}</h2>
              </div>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">World-Class Architects</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {worldClassArchitects.map((a) => (
            <article key={a.name} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <img src={a.image} alt={a.name} className="h-52 w-full object-cover" />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{a.name}</h3>
                <p className="text-sm text-gray-600">{a.firm}</p>
                <p className="text-sm text-gray-700">{a.contribution}</p>
                <p className="text-sm text-indigo-700 inline-flex items-center gap-2">
                  <Mail size={16} />
                  {a.email}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}