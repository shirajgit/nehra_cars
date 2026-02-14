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
     <section
  id="cars"
  className="relative px-4 py-16 bg-gradient-to-b from-white via-sky-50/40 to-white overflow-hidden"
>
  {/* Background Glow */}
  <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-sky-400/10 blur-[120px] rounded-full"></div>
  <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-indigo-400/10 blur-[120px] rounded-full"></div>

  <div className="relative max-w-7xl mx-auto mb-10 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-extrabold tracking-tight"
    >
      Available Cars
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      viewport={{ once: true }}
      className="text-slate-600 mt-3"
    >
      Choose your ride and book instantly. Premium quality, transparent pricing.
    </motion.p>
  </div>

  {/* Grid */}
  <div className="relative max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {CARS.map((car, index) => (
      <motion.div
        key={car.id}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        viewport={{ once: true }}
        className="group rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        {/* Image */}
        <div className="relative h-52 bg-slate-100 overflow-hidden">
          <img
            src={car.img}
            alt={car.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Tag */}
          <span className="absolute left-4 top-4 text-xs font-bold px-3 py-1 rounded-full text-white
            bg-gradient-to-r from-sky-500 to-indigo-600 shadow-lg">
            {car.tag}
          </span>

          {/* Price floating badge */}
          <div className="absolute right-4 bottom-4 bg-white/90 backdrop-blur border border-slate-200 rounded-xl px-3 py-1 shadow-md text-sm font-bold">
            {formatINR(car.pricePerDay)}{" "}
            <span className="text-xs text-slate-500">/day</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 grid gap-4">
          <div className="font-extrabold text-lg">{car.name}</div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span>👤 {car.seats} Seats</span>
            <span>⛽ {car.fuel}</span>
            <span>⚙️ {car.transmission}</span>
          </div>

          <button
            onClick={() => bookThisCar(car.id)}
            className="w-full rounded-xl px-4 py-3 font-extrabold text-white
              bg-gradient-to-r from-sky-500 to-indigo-600
              shadow-lg hover:scale-105 transition duration-300"
          >
            Book this car →
          </button>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* How it works */}
     <section
  id="how"
  className="relative px-4 py-16 bg-gradient-to-b from-white via-indigo-50/40 to-white overflow-hidden"
>
  {/* Glow */}
  <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-indigo-400/10 blur-[120px] rounded-full" />
  <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] bg-sky-400/10 blur-[120px] rounded-full" />

  <div className="relative max-w-7xl mx-auto mb-10 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-extrabold tracking-tight"
    >
      How it works
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      viewport={{ once: true }}
      className="text-slate-600 mt-3"
    >
      Fast booking, instant WhatsApp confirmation.
    </motion.p>
  </div>

  {/* Steps */}
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    }}
    className="relative max-w-7xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
  >
    {[
      { n: "01", t: "Choose a car", d: "Pick the car that fits your trip and budget.", icon: "🚗" },
      { n: "02", t: "Fill booking details", d: "Pickup, drop dates and your location.", icon: "📝" },
      { n: "03", t: "WhatsApp confirmation", d: "We receive your request instantly on WhatsApp.", icon: "💬" },
      { n: "04", t: "Pickup & drive", d: "Complete verification and enjoy your ride.", icon: "✅" },
    ].map((s) => (
      <motion.div
        key={s.n}
        variants={{
          hidden: { opacity: 0, y: 30 },
          show: { opacity: 1, y: 0 },
        }}
        className="group relative rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6 overflow-hidden"
      >
        {/* top glow strip */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-600" />

        {/* Number + Icon */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-md">
            Step {s.n}
          </span>

          <span className="w-11 h-11 grid place-items-center rounded-2xl bg-slate-50 border border-slate-200 shadow-sm text-xl group-hover:scale-110 transition duration-300">
            {s.icon}
          </span>
        </div>

        <div className="mt-4 font-extrabold text-lg">{s.t}</div>
        <div className="mt-2 text-sm text-slate-600 leading-relaxed">
          {s.d}
        </div>

        {/* subtle background decoration */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/5 blur-2xl" />
      </motion.div>
    ))}
  </motion.div>
</section>


      {/* Booking */}
     <section
  id="booking"
  className="relative px-4 py-20 bg-gradient-to-b from-white via-sky-50/40 to-white overflow-hidden"
>
  {/* Background Glow */}
  <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-400/10 blur-[120px] rounded-full"></div>
  <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sky-400/10 blur-[120px] rounded-full"></div>

  <div className="relative max-w-7xl mx-auto mb-10 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-extrabold tracking-tight"
    >
      Booking Request
    </motion.h2>

    <p className="text-slate-600 mt-3">
      Submit → it will open WhatsApp with all booking details.
    </p>
  </div>

  <div className="relative max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1fr_0.42fr] items-start">

    {/* FORM */}
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl p-8 grid gap-6"
    >
      {/* Row 1 */}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name">
          <input
            className="inputStyle"
            placeholder="Your name"
            value={form.name}
            onChange={onChange("name")}
          />
        </Field>

        <Field label="Phone (10 digits)">
          <input
            className="inputStyle"
            placeholder="9876543210"
            inputMode="numeric"
            value={form.phone}
            onChange={onChange("phone")}
          />
        </Field>
      </div>

      <Field label="Select Car">
        <select
          className="inputStyle"
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

      {/* Dates */}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Pickup Date">
          <input
            className="inputStyle"
            type="date"
            value={form.pickupDate}
            onChange={onChange("pickupDate")}
          />
        </Field>

        <Field label="Drop Date">
          <input
            className="inputStyle"
            type="date"
            value={form.dropDate}
            onChange={onChange("dropDate")}
          />
        </Field>
      </div>

      <Field label="Pickup Location">
        <input
          className="inputStyle"
          placeholder="Airport / Railway Station / City"
          value={form.pickupLocation}
          onChange={onChange("pickupLocation")}
        />
      </Field>

      <Field label="Notes (optional)">
        <textarea
          className="inputStyle min-h-[110px]"
          placeholder="Any special request?"
          value={form.note}
          onChange={onChange("note")}
        />
      </Field>

      {/* Estimate + Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-50 to-indigo-50 p-6">
        <div>
          <div className="text-sm text-slate-700">
            Estimated Total:{" "}
            <span className="text-lg font-extrabold text-indigo-600">
              {estTotal ? formatINR(estTotal) : "-"}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            (Estimate: days × price/day)
          </div>
        </div>

        <button
          type="submit"
          className="px-7 py-3 rounded-xl font-extrabold text-white
            bg-gradient-to-r from-sky-500 to-indigo-600
            shadow-lg hover:scale-105 transition duration-300"
        >
          Submit on WhatsApp →
        </button>
      </div>
    </motion.form>

    {/* ASIDE */}
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="grid gap-5"
    >
      {[
        { title: "Service Area", text: "Delhi NCR" },
        { title: "Documents Required", text: "Driving License + ID Proof" },
        { title: "Instant Support", text: "WhatsApp & Call buttons available." },
      ].map((card) => (
        <div
          key={card.title}
          className="rounded-3xl bg-white border border-slate-200 shadow-md p-6 hover:shadow-xl transition"
        >
          <div className="font-extrabold text-lg">{card.title}</div>
          <div className="text-slate-600 mt-2 text-sm leading-relaxed">
            {card.text}
          </div>
        </div>
      ))}
    </motion.aside>
  </div>
</section>


      {/* ✅ Light Footer component */}
      <FooterPro
        brandName="Nehra Car Rental"
        phone="+91 99999 99999"
        whatsappNumber={DEMO_WHATSAPP_NUMBER}
        email="info@nehracarrental.com"  
        mapEmbedSrc="https://www.google.com/maps?q=Delhi%20NCR&output=embed"
     
      />
    </div>
  );
}

/* ---------- Small components ---------- */
 

function Topbar({
  onCars,
  onBook,
}: {
  onCars: () => void;
  onBook: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-slate-200"
          : "bg-white/70 backdrop-blur border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-12 w-14 rounded-xl shadow-sm"
          />
          <div>
            <div className="font-extrabold text-lg tracking-tight">
              Nehra Car Rental
            </div>
            <div className="text-xs text-slate-600">
              Self Drive • Instant Booking
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-3 flex-wrap"
        >
          <button
            onClick={onCars}
            className="relative px-5 py-2 rounded-xl font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition group"
          >
            View Cars
            <span className="absolute left-4 bottom-1 h-[2px] w-0 bg-sky-500 transition-all duration-300 group-hover:w-6"></span>
          </button>

          <button
            onClick={onBook}
            className="px-6 py-2 rounded-xl font-extrabold text-white 
                       bg-gradient-to-r from-sky-500 to-indigo-600 
                       shadow-lg shadow-sky-400/30 
                       hover:scale-105 hover:shadow-xl 
                       transition duration-300"
          >
            Book Now
          </button>
        </motion.div>
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
            All Over Haryana
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

 
 
