import React from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Amit Patel",
      role: "Homeowner",
      comment:
        "Found my dream home design in just minutes! The AI recommendations were spot-on.",
      rating: 5,
    },
    {
      name: "Sneha Sharma",
      role: "Architect",
      comment:
        "Excellent platform to showcase our designs. Very easy to upload and manage projects.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Homeowner",
      comment:
        "The Vastu-compliant designs were exactly what I was looking for. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative container-custom">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block mb-3 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Trusted by Users
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            What Our Users Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Real experiences from homeowners and architects using AI Home
            Designer.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gray-200 bg-white/70 p-8 backdrop-blur
              shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* quote */}
              <p className="mb-6 text-gray-700 leading-relaxed">
                “{testimonial.comment}”
              </p>

              {/* user */}
              <div className="pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
                <p className="text-sm text-blue-600">
                  {testimonial.role}
                </p>
              </div>

              {/* hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-blue-400/30 transition" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
