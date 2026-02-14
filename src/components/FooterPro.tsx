 

export default function FooterPro({
  brandName = "Nehra Car Rental",
  phone = "+91 99928 20332",
  whatsappNumber = "919036692164",
  email = "info@nehracarrental.com", 
  mapEmbedSrc = "https://www.google.com/maps/place/Rohtak,+Haryana/@28.8895298,76.5751352,13z/data=!3m1!4b1!4m6!3m5!1s0x390d85a5414251a5:0x9f011cc2777a4544!8m2!3d28.8955152!4d76.606611!16zL20vMDk4MHYz?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D&output=embed",
 
}) {
  const waLink = `https://wa.me/${whatsappNumber}?text=Hi ${brandName}`;
  const callLink = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <>
    {/* WhatsApp Floating Button */}
<a
  href={waLink}
  target="_blank"
  rel="noreferrer"
  className="fixed bottom-6 right-6 z-50 group"
>
  <div className="relative flex items-center justify-center w-14 h-14 rounded-full 
                  bg-gradient-to-br from-green-400 to-green-600 
                  shadow-2xl shadow-green-400/40
                  transition duration-300 hover:scale-110">

    {/* Pulse Ring */}
    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 animate-ping"></span>

    {/* Icon */}
    <span className="relative text-2xl">💬</span>
  </div>

  {/* Tooltip */}
  <span className="absolute right-16 top-1/2 -translate-y-1/2 
                   bg-black text-white text-xs px-3 py-1 rounded-md 
                   opacity-0 group-hover:opacity-100 transition">
    Chat on WhatsApp
  </span>
</a>


{/* Sticky Call Button */}
<a
  href={callLink}
  className="fixed bottom-24 right-6 z-50 group"
>
  <div className="relative flex items-center justify-center w-14 h-14 rounded-full 
                  bg-gradient-to-br from-blue-500 to-indigo-600 
                  shadow-2xl shadow-blue-400/40
                  transition duration-300 hover:scale-110">

    {/* Glow Ring */}
    <span className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl"></span>

    {/* Icon */}
    <span className="relative text-2xl">📞</span>
  </div>

  {/* Tooltip */}
  <span className="absolute right-16 top-1/2 -translate-y-1/2 
                   bg-black text-white text-xs px-3 py-1 rounded-md 
                   opacity-0 group-hover:opacity-100 transition">
    Call Now
  </span>
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
              <li> <a href="" className="">  </a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>📍 Rohtak, Haryana</li>
              <li>📞 +91 99928 20332</li>
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
