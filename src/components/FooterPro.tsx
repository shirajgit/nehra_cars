import React from "react";

export default function FooterPro({
  brandName = "Nehra Car Rental",
  phone = "+91 99999 99999",
  whatsappNumber = "919036692164",
  email = "info@nehracarrental.com",
  locationText = "Delhi NCR",
  mapEmbedSrc = "https://www.google.com/maps?q=Delhi%20NCR&output=embed",
 
}) {
  const waLink = `https://wa.me/${whatsappNumber}?text=Hi ${brandName}`;
  const callLink = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <>
      {/* Floating WhatsApp */}
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-5 z-50"
      >
        <div className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-xl transition hover:scale-105">
          💬
        </div>
      </a>

      {/* Sticky Call */}
      <a
        href={callLink}
        className="fixed bottom-22 right-5 z-50"
      >
        <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-xl transition hover:scale-105">
          📞
        </div>
      </a>

      {/* Footer */}
      <footer className="relative mt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-t border-slate-200">

        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div >
            <img src="/logo.png" alt="Nehra Car Rental Logo" className="w-16 h-16 object-contain" />
            <h2 className="text-2xl font-bold text-slate-800">
              {brandName}
            </h2>
            <p className="text-slate-600 mt-4 text-sm leading-relaxed">
              Premium self-drive car rental service with
              transparent pricing and instant booking support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#cars" className="hover:text-blue-600 transition">Available Cars</a></li>
              <li><a href="#booking" className="hover:text-blue-600 transition">Book Now</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>📍 {locationText}</li>
              <li>📞 {phone}</li>
              <li>✉️ {email}</li>
            </ul>
          </div>

          {/* Google Map */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Find Us</h3>
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
              <iframe
                title="Google Map"
                src={mapEmbedSrc}
                className="w-full h-48"
                loading="lazy"
              />
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 text-center py-5 text-sm text-slate-500">
          © {new Date().getFullYear()} {brandName}. All rights reserved. <br />
        <p>
              Designed & Developed with{" "}
              <span className="text-red-500">❤️</span> by{" "}
              <a
                href="https://aishi-technologies.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-900 hover:underline"
              >
                <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-fuchsia-600 bg-clip-text text-transparent">
                  AISHI Technologies
                </span>
              </a>
            </p>
        </div>

      </footer>
    </>
  );
}
