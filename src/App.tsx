import React, { useEffect, useMemo, useState } from "react";
import FooterPro from "./components/FooterPro";
import { motion, AnimatePresence } from "framer-motion";


const DEMO_WHATSAPP_NUMBER = "919036692164"; // no +

const CARS = [
  {
    id: "swift",
    name: "Maruti Swift",
    pricePerDay: 1299,
    seats: 5,
    fuel: "Petrol",
    transmission: "Manual",
    tag: "Best Seller",
    img: "/swift.jpg",
  },
  {
    id: "i20",
    name: "Hyundai i20",
    pricePerDay: 1499,
    seats: 5,
    fuel: "Petrol",
    transmission: "Automatic",
    tag: "Premium",
    img: "/Hyundai i20.avif",
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    pricePerDay: 2999,
    seats: 7,
    fuel: "Diesel",
    transmission: "Automatic",
    tag: "Premium",
    img: "/Toyota-Fortuner.webp",
  },
  {
    id: "baleno",
    name: "Maruti Baleno",
    pricePerDay: 1399,
    seats: 5,
    fuel: "Petrol",
    transmission: "Manual",
    tag: "Value",
    img: "/Maruti Baleno.jpg",
  },
  {
    id: "creta",
    name: "Hyundai Creta",
    pricePerDay: 2499,
    seats: 5,
    fuel: "Diesel",
    transmission: "Manual",
    tag: "SUV",
    img: "/Hyundai Creta.avif",
  },
  {
    id: "thar",
    name: "Mahindra Thar",
    pricePerDay: 3499,
    seats: 4,
    fuel: "Diesel",
    transmission: "Manual",
    tag: "Adventure",
    img: "/Mahindra Thar.jpeg",
  },
];

type Car = (typeof CARS)[number];

function formatINR(n: number) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
function daysBetween(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e.getTime() - s.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return isFinite(days) ? Math.max(days, 0) : 0;
}
function clampPhone10(s: string) {    
  return (s || "").replace(/\D/g, "").slice(0, 10);
}

export default function App() {
  const [selectedCarId, setSelectedCarId] = useState(CARS[0].id);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickupDate: "",
    dropDate: "",
    pickupTime: "10:00",
    dropTime: "10:00",
    pickupLocation: "Delhi NCR",
    note: "",
  });

  const selectedCar = useMemo(
    () => CARS.find((c) => c.id === selectedCarId) || CARS[0],
    [selectedCarId]
  );

  const rentalDays = useMemo(
    () => daysBetween(form.pickupDate, form.dropDate),
    [form.pickupDate, form.dropDate]
  );

  const estTotal = useMemo(() => {
    if (!rentalDays) return 0;
    return rentalDays * selectedCar.pricePerDay;
  }, [rentalDays, selectedCar.pricePerDay]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = key === "phone" ? clampPhone10(e.target.value) : e.target.value;
      setForm((p) => ({ ...p, [key]: value }));
    };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!/^\d{10}$/.test(form.phone.trim())) return "Please enter a valid 10-digit phone number";
    if (!form.pickupDate) return "Please select pickup date";
    if (!form.dropDate) return "Please select drop date";
    if (new Date(form.dropDate) <= new Date(form.pickupDate)) return "Drop date must be after pickup date";
    if (!form.pickupLocation.trim()) return "Please enter pickup location";
    return null;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const msgLines = [
      "🚗 New Booking Request",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Car: ${selectedCar.name}`,
      `Pickup: ${form.pickupDate} ${form.pickupTime}`,
      `Drop: ${form.dropDate} ${form.dropTime}`,
      `Location: ${form.pickupLocation}`,
      `Days: ${rentalDays}`,
      `Estimated Total: ${formatINR(estTotal)}`,
      form.note?.trim() ? `Note: ${form.note.trim()}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(msgLines.join("\n"));
    window.open(`https://wa.me/${DEMO_WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const bookThisCar = (carId: string) => {
    setSelectedCarId(carId);
    scrollTo("booking");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 text-slate-900">
      <Topbar onCars={() => scrollTo("cars")} onBook={() => scrollTo("booking")} />

      <Hero
        selectedCar={selectedCar}
        carId={selectedCarId}
        setCarId={setSelectedCarId}
        pickupDate={form.pickupDate}
        dropDate={form.dropDate}
        setPickup={(v) => setForm((p) => ({ ...p, pickupDate: v }))}
        setDrop={(v) => setForm((p) => ({ ...p, dropDate: v }))}
        rentalDays={rentalDays}
        estTotal={estTotal}
        onExplore={() => scrollTo("cars")}
        onBook={() => scrollTo("booking")}
      />

      {/* Cars */}
      <section id="cars" className="px-4 py-12">
        <div className="max-w-7xl mx-auto mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Available Cars</h2>
          <p className="text-slate-600 mt-2">
            Demo listings. We’ll replace with your real cars, pricing & photos.
          </p>
        </div>

        {/* ✅ lg=3 columns */}
        <div className="max-w-7xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARS.map((car) => (
            <div
              key={car.id}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={car.img}
                  alt={car.name}
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-300"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 text-xs font-extrabold px-3 py-1 rounded-full text-white
                  bg-gradient-to-r from-sky-500 to-indigo-500 shadow">
                  {car.tag}
                </span>
              </div>

              <div className="p-4 grid gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-extrabold">{car.name}</div>
                  <div className="font-extrabold">
                    {formatINR(car.pricePerDay)} <span className="text-xs text-slate-500">/day</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-700">
                  <span>👤 {car.seats} Seats</span>
                  <span>⛽ {car.fuel}</span>
                  <span>⚙️ {car.transmission}</span>
                </div>

                <button
                  onClick={() => bookThisCar(car.id)}
                  className="w-full rounded-xl px-4 py-3 font-extrabold text-white
                    bg-gradient-to-r from-sky-500 to-indigo-500
                    hover:opacity-95 active:scale-[0.99] transition shadow-md"
                >
                  Book this car →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 pb-4">
        <div className="max-w-7xl mx-auto mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">How it works</h2>
          <p className="text-slate-600 mt-2">Fast booking, instant WhatsApp confirmation.</p>
        </div>

        <div className="max-w-7xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Choose a car", d: "Pick the car that fits your trip and budget." },
            { n: "02", t: "Fill booking details", d: "Pickup, drop dates and your location." },
            { n: "03", t: "WhatsApp confirmation", d: "We receive your request instantly on WhatsApp." },
            { n: "04", t: "Pickup & drive", d: "Complete verification and enjoy your ride." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 hover:shadow-lg transition">
              <div className="text-slate-500 font-extrabold">{s.n}</div>
              <div className="mt-2 font-extrabold">{s.t}</div>
              <div className="mt-2 text-sm text-slate-600 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="px-4 py-12">
        <div className="max-w-7xl mx-auto mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Booking Request</h2>
          <p className="text-slate-600 mt-2">Submit → it will open WhatsApp with all booking details.</p>
        </div>

        <div className="max-w-7xl mx-auto grid gap-5 lg:grid-cols-[1fr_0.42fr] items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 grid gap-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="Your name"
                  value={form.name}
                  onChange={onChange("name")}
                />
              </Field>
              <Field label="Phone (10 digits)">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="9876543210"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
              </Field>
            </div>

            <Field label="Select Car">
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
              >
                {CARS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} • {formatINR(c.pricePerDay)}/day
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Pickup Date">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                  type="date"
                  value={form.pickupDate}
                  onChange={onChange("pickupDate")}
                />
              </Field>
              <Field label="Pickup Time">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                  type="time"
                  value={form.pickupTime}
                  onChange={onChange("pickupTime")}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Drop Date">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                  type="date"
                  value={form.dropDate}
                  onChange={onChange("dropDate")}
                />
              </Field>
              <Field label="Drop Time">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                  type="time"
                  value={form.dropTime}
                  onChange={onChange("dropTime")}
                />
              </Field>
            </div>

            <Field label="Pickup Location">
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="e.g., Airport / Railway Station / City"
                value={form.pickupLocation}
                onChange={onChange("pickupLocation")}
              />
            </Field>

            <Field label="Notes (optional)">
              <textarea
                className="w-full min-h-[90px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Any special request?"
                value={form.note}
                onChange={onChange("note")}
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <div className="text-sm text-slate-700">
                  Estimated Total: <b>{estTotal ? formatINR(estTotal) : "-"}</b>
                </div>
                <div className="text-xs text-slate-500 mt-1">(Estimate: days × price/day)</div>
              </div>

              <button
                type="submit"
                className="rounded-xl px-5 py-3 font-extrabold text-white
                  bg-gradient-to-r from-sky-500 to-indigo-500
                  hover:opacity-95 active:scale-[0.99] transition shadow-md"
              >
                Submit on WhatsApp
              </button>
            </div>
          </form>

          <aside className="grid gap-4">
            <InfoCard title="Service Area" text="Delhi NCR (Demo)" />
            <InfoCard title="Documents" text="Driving License + ID Proof" />
            <InfoCard title="Instant Support" text="WhatsApp & Call buttons available on screen." />
          </aside>
        </div>
      </section>

      {/* ✅ Light Footer component */}
      <FooterPro
        brandName="Nehra Car Rental"
        phone="+91 99999 99999"
        whatsappNumber={DEMO_WHATSAPP_NUMBER}
        email="info@nehracarrental.com"
        locationText="Delhi NCR"
        mapEmbedSrc="https://www.google.com/maps?q=Delhi%20NCR&output=embed"
     
      />
    </div>
  );
}

/* ---------- Small components ---------- */

function Topbar({ onCars, onBook }: { onCars: () => void; onBook: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-11 w-auto rounded-xl" />
          <div>
            <div className="font-extrabold">Nehra Car Rental</div>
            <div className="text-xs text-slate-600">Self Drive • Instant Booking</div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onCars}
            className="rounded-xl px-4 py-2 font-bold border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            View Cars
          </button>
          <button
            onClick={onBook}
            className="rounded-xl px-4 py-2 font-extrabold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-95 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  );
}
function Hero({
 
  onExplore,
  onBook,
}: {
  selectedCar: Car;
  carId: string;
  setCarId: (v: string) => void;
  pickupDate: string;
  dropDate: string;
  setPickup: (v: string) => void;
  setDrop: (v: string) => void;
  rentalDays: number;
  estTotal: number;
  onExplore: () => void;
  onBook: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const it = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % CARS.length);
    }, 4000);
    return () => clearInterval(it);
  }, []);

  const slide = CARS[currentIndex];

  return (
    <section className="relative px-4 pt-12 pb-10 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-400/20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sky-400/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-2 items-center relative z-10">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-slate-200 shadow-sm text-sm font-semibold">
            🚗 Self Drive Car Rentals
          </div>

          <h1 className="mt-6 text-[clamp(32px,4vw,48px)] font-extrabold leading-tight tracking-tight">
            Premium Car Rentals in{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Delhi NCR
            </span>
          </h1>

          <p className="mt-4 text-slate-600 text-lg leading-relaxed max-w-xl">
            Experience seamless self-drive booking with transparent pricing
            and instant WhatsApp confirmation.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-lg hover:scale-105 transition"
            >
              Explore Cars
            </button>

            <button
              onClick={onBook}
              className="px-6 py-3 rounded-xl font-bold border border-slate-300 bg-white hover:bg-slate-50 transition"
            >
              Book Now
            </button>
          </div>
        </motion.div>

        {/* Right Slider */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white/40 backdrop-blur-xl">

          <AnimatePresence mode="wait">
            <motion.img
              key={slide.id}
              src={slide.img}
              alt={slide.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-[320px] md:h-[420px] object-cover"
            />
          </AnimatePresence>

          {/* Glass Overlay Info */}
          <motion.div
            key={slide.id + "info"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-6 left-6 bg-white/70 backdrop-blur-lg border border-slate-200 rounded-2xl px-5 py-4 shadow-lg"
          >
            <div className="text-xl font-bold">{slide.name}</div>
            <div className="text-sm text-slate-600 mt-1">
              {formatINR(slide.pricePerDay)}/day • {slide.seats} seats •{" "}
              {slide.transmission}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold text-slate-600 mb-2">{label}</div>
      {children}
    </div>
  );
}

 

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 hover:shadow-lg transition">
      <div className="font-extrabold">{title}</div>
      <div className="text-sm text-slate-600 mt-2 leading-relaxed">{text}</div>
    </div>
  );
}
