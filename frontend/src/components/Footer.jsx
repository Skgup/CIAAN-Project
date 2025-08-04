import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* ✅ Footer Links */}
        <div className="flex flex-wrap justify-center sm:justify-between text-xs text-gray-600 gap-3">
          {[
            { label: "About", to: "/about" },
            { label: "Accessibility", to: "/accessibility" },
            { label: "Privacy & Terms", to: "/privacy" },
            { label: "Help Center", to: "/help" },
            { label: "Contact", to: "/contact" },
            { label: "Advertising", to: "/ads" },
            { label: "Business Services", to: "/business" },
            { label: "Get the App", to: "/app" }
          ].map((link, i) => (
            <Link key={i} to={link.to} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </div>

        {/* ✅ Divider */}
        <hr className="my-4 border-gray-200" />

        {/* ✅ Branding & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-blue-700 font-bold text-lg">in</span>
            <span className="font-semibold text-gray-700">MiniLinkedIn</span>
          </div>
          <p className="mt-2 sm:mt-0">© {new Date().getFullYear()} MiniLinkedIn Corporation. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
