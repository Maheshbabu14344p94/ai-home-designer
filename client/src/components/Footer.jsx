import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative container-custom py-20">
        <div className="grid gap-12 md:grid-cols-4 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              AI Home Designer
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Connecting architects and homeowners through{" "}
              <span className="text-blue-400">AI-powered</span> design
              recommendations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-5 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About", "Testimonials"].map((item) => (
                <li key={item}>
                  <a
                    href={
                      item === "Home"
                        ? "/"
                        : `#${item.toLowerCase()}`
                    }
                    className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
                  >
                    <span className="h-[2px] w-0 bg-blue-500 group-hover:w-4 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-white">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3 hover:text-white transition">
                <Mail size={18} className="text-blue-400 mt-1" />
                support@aihomedesigner.com
              </li>
              <li className="flex items-start gap-3 hover:text-white transition">
                <Phone size={18} className="text-blue-400 mt-1" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-3 hover:text-white transition">
                <MapPin size={18} className="text-blue-400 mt-1" />
                Gayatri Vidya Parishad College, Visakhapatnam
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-5 text-white">Follow Us</h4>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-3 rounded-xl bg-gray-800/60 text-gray-400 hover:text-white hover:bg-blue-500/20 hover:scale-110 transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-medium">
              AI Home Designer
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
