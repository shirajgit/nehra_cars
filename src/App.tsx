import React, { useEffect, useMemo, useState } from "react";

const DEMO_WHATSAPP_NUMBER = "919036692164"; // replace later (no +)

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

interface Car {
  id: string;
  name: string;
  pricePerDay: number;
  seats: number;
  fuel: string;
  transmission: string;
  tag: string;
  img: string;
}

 

function formatINR(n :number) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
function daysBetween(start :string | number, end :string | number) {
  const s = new Date(start);
  const e = new Date(end);
  const ms : number = e.getTime() - s.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return isFinite(days) ? Math.max(days, 0) : 0;
}
function clampPhone10(s :string) {
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

  const scrollTo = (id :string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

const onChange =
  (key: string) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val =
      key === "phone"
        ? clampPhone10(e.target.value)
        : e.target.value;

    setForm((p) => ({ ...p, [key]: val }));
  };


  const validate = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!/^\d{10}$/.test(form.phone.trim()))
      return "Please enter a valid 10-digit phone number";
    if (!form.pickupDate) return "Please select pickup date";
    if (!form.dropDate) return "Please select drop date";
    if (new Date(form.dropDate) <= new Date(form.pickupDate))
      return "Drop date must be after pickup date";
    if (!form.pickupLocation.trim()) return "Please enter pickup location";
    return null;
  };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
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
    window.open(
      `https://wa.me/${DEMO_WHATSAPP_NUMBER}?text=${text}`,
      "_blank"
    );
  };

  const bookThisCar = (carId :string) => {
    setSelectedCarId(carId);
    scrollTo("booking");
  };

  return (
    <div style={S.page}>
      <Topbar onCars={() => scrollTo("cars")} onBook={() => scrollTo("booking")} />

      <Hero
        car ={selectedCar}
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

      <section id="cars" style={S.section}>
        <div style={S.sectionHead}>
          <h2 style={S.h2}>Available Cars</h2>
          <p style={S.muted}>
            Demo listings. We’ll replace with your real cars, pricing & photos.
          </p>
        </div>

        <div className="cars-grid" style={{ maxWidth: 1120, margin: "0 auto" }}>
          {CARS.map((car) => (
            <div
              key={car.id}
              style={S.card}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
            >
              <div style={S.cardImgWrap}>
                <img src={car.img} alt={car.name} style={S.cardImg} loading="lazy" />
                <div style={S.badge}>{car.tag}</div>
              </div>

              <div style={S.cardBody}>
                <div style={S.cardTopRow}>
                  <div style={S.carName}>{car.name}</div>
                  <div style={S.price}>
                    {formatINR(car.pricePerDay)}{" "}
                    <span style={S.perDay}>/day</span>
                  </div>
                </div>

                <div style={S.meta}>
                  <span>👤 {car.seats} Seats</span>
                  <span>⛽ {car.fuel}</span>
                  <span>⚙️ {car.transmission}</span>
                </div>

                <button style={S.primaryBtn} onClick={() => bookThisCar(car.id)}>
                  Book this car →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...S.section, paddingTop: 0 }}>
        <div style={S.sectionHead}>
          <h2 style={S.h2}>How it works</h2>
          <p style={S.muted}>Fast booking, instant WhatsApp confirmation.</p>
        </div>

        <div style={S.steps}>
          {[
            { n: "01", t: "Choose a car", d: "Pick the car that fits your trip and budget." },
            { n: "02", t: "Fill booking details", d: "Pickup, drop dates and your location." },
            { n: "03", t: "WhatsApp confirmation", d: "We receive your request instantly on WhatsApp." },
            { n: "04", t: "Pickup & drive", d: "Complete verification and enjoy your ride." },
          ].map((s) => (
            <div key={s.n} style={S.stepCard}>
              <div style={S.stepN}>{s.n}</div>
              <div style={S.stepT}>{s.t}</div>
              <div style={S.stepD}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" style={S.section}>
        <div style={S.sectionHead}>
          <h2 style={S.h2}>Booking Request</h2>
          <p style={S.muted}>
            Submit → it will open WhatsApp with all booking details.
          </p>
        </div>

        <div style={S.bookingWrap}>
          <form style={S.form} onSubmit={handleSubmit}>
            <div style={S.row2}>
              <Field label="Full Name">
                <input
                  style={S.input}
                  placeholder="Your name"
                  value={form.name}
                  onChange={onChange("name")}
                />
              </Field>
              <Field label="Phone (10 digits)">
                <input
                  style={S.input}
                  placeholder="9876543210"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
              </Field>
            </div>

            <Field label="Select Car">
              <select
                style={S.input}
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

            <div style={S.row2}>
              <Field label="Pickup Date">
                <input
                  style={S.input}
                  type="date"
                  value={form.pickupDate}
                  onChange={onChange("pickupDate")}
                />
              </Field>
              <Field label="Pickup Time">
                <input
                  style={S.input}
                  type="time"
                  value={form.pickupTime}
                  onChange={onChange("pickupTime")}
                />
              </Field>
            </div>

            <div style={S.row2}>
              <Field label="Drop Date">
                <input
                  style={S.input}
                  type="date"
                  value={form.dropDate}
                  onChange={onChange("dropDate")}
                />
              </Field>
              <Field label="Drop Time">
                <input
                  style={S.input}
                  type="time"
                  value={form.dropTime}
                  onChange={onChange("dropTime")}
                />
              </Field>
            </div>

            <Field label="Pickup Location">
              <input
                style={S.input}
                placeholder="e.g., Airport / Railway Station / City"
                value={form.pickupLocation}
                onChange={onChange("pickupLocation")}
              />
            </Field>

            <Field label="Notes (optional)">
              <textarea
                style={{ ...S.input, minHeight: 90, resize: "vertical" }}
                placeholder="Any special request?"
                value={form.note}
                onChange={onChange("note")}
              />
            </Field>

            <div style={S.formFooter}>
              <div>
                <div style={S.total}>
                  Estimated Total:{" "}
                  <strong>{estTotal ? formatINR(estTotal) : "-"}</strong>
                </div>
                <div style={S.small}>(Estimate: days × price/day)</div>
              </div>

              <button type="submit" style={S.primaryBtnLg}>
                Submit on WhatsApp
              </button>
            </div>
          </form>

          <aside style={S.aside}>
            <div style={S.asideCard}>
              <div style={S.asideTitle}>Service Area</div>
              <div style={S.asideText}>Delhi NCR (Demo)</div>
            </div>
            <div style={S.asideCard}>
              <div style={S.asideTitle}>Documents</div>
              <div style={S.asideText}>Driving License + ID Proof</div>
            </div>
            <div style={S.asideCard}>
              <div style={S.asideTitle}>Instant Support</div>
              <div style={S.asideText}>
                Call / WhatsApp buttons will be added with the real number.
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div>
            <div style={S.footerTitle}>Nehra Car Rental</div>
            <div style={S.footerText}>
              Demo website for preview • Replace with real cars, pricing & images.
            </div>
          </div>
          <div style={S.footerText}>Built by AISHI Technologies</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Small components ---------- */

function Topbar({ onCars, onBook }: { onCars: () => void; onBook: () => void }) {
  return (
    <header style={S.topbar}>
      <div style={S.brand}>
        <img
          src="/logo.png"
          alt="Nehra Car Rental Logo"
          style={{ height: "44px", width: "auto", borderRadius: 10 }}
        />
        <div>
          <div style={S.brandName}>Nehra Car Rental</div>
          <div style={S.brandTag}>Self Drive • Instant Booking</div>
        </div>
      </div>
      <div style={S.actions}>
        <button style={S.secondaryBtn} onClick={onCars}>
          View Cars
        </button>
        <button style={S.primaryBtnSm} onClick={onBook}>
          Book Now
        </button>
      </div>
    </header>
  );
}

function Hero({ car, carId, setCarId, pickupDate, dropDate, setPickup, setDrop, rentalDays, estTotal, onExplore, onBook }: {
  car :Car,
  carId :string,
  setCarId :(v :string) => void   ,
  pickupDate :string,
  dropDate :string,
  setPickup :(v :string) => void,
  setDrop :(v :string) => void,
  rentalDays :number | null,
  estTotal :number | null,
  onExplore :() => void,
  onBook :() => void,
})  
{
  const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % CARS.length);
  }, 3000); // change every 3 seconds

  return () => clearInterval(interval);
}, []);

  return (
    <section style={S.hero}>
      <div style={S.heroInner}>
        <div>
          <div style={S.pill}>🚗 Self Drive Car Rentals</div>

          <h1 style={S.h1}>
            Self Drive car rentals in{" "}
            <span style={S.gradText}>Delhi NCR</span>
            <br />
            <span style={S.h1Sub}>Starting from just ₹1299/day</span>
          </h1>

          <p style={S.sub}>
            Clean cars, transparent pricing, and instant WhatsApp confirmation.
            Perfect for trips, weekends, and daily needs.
          </p>

          <div style={S.heroBtns}>
            <button style={S.primaryBtnLg} onClick={onExplore}>
              Explore Cars
            </button>
            <button style={S.secondaryBtn} onClick={onBook}>
              Book on WhatsApp
            </button>
          </div>

          <div style={S.trust}>
            <div style={S.trustItem}>✅ Verified listings</div>
            <div style={S.trustItem}>✅ Quick booking</div>
            <div style={S.trustItem}>✅ Flexible pickup</div>
          </div>
        </div>

        <div style={S.heroCard}>
          <div style={S.heroCardHead}>
            <div style={S.heroCardTitle}>Quick Estimate</div>
            <div style={S.heroCardSub}>Select car + dates</div>
          </div>

          <div style={S.heroCardBody}>
            <Field label="Car">
              <select
                style={S.input}
                value={carId}
                onChange={(e) => setCarId(e.target.value)}
              >
                {CARS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} • {formatINR(c.pricePerDay)}/day
                  </option>
                ))}
              </select>
            </Field>

            <div style={S.row2}>
              <Field label="Pickup Date">
                <input
                  style={S.input}
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </Field>
              <Field label="Drop Date">
                <input
                  style={S.input}
                  type="date"
                  value={dropDate}
                  onChange={(e) => setDrop(e.target.value)}
                />
              </Field>
            </div>

            <div style={S.estimate}>
              <div style={S.estimateRow}>
                <span>Selected</span>
                <strong>{car.name}</strong>
              </div>
              <div style={S.estimateRow}>
                <span>Days</span>
                <strong>{rentalDays || "-"}</strong>
              </div>
              <div style={S.estimateRow}>
                <span>Estimate</span>
                <strong>{estTotal ? formatINR(estTotal) : "-"}</strong>
              </div>
              <div style={S.small}>
                Final price may vary based on availability & policy.
              </div>
            </div>

            <button style={S.primaryBtnLg} onClick={onBook}>
              Continue to Booking →
            </button>
          </div>
        </div>
      </div>

      <div style={S.heroImageStrip}>
  <img
    src={CARS[currentIndex].img}
    alt={CARS[currentIndex].name}
    style={{
      ...S.heroImg,
      transition: "opacity 0.6s ease-in-out",
    }}
  />

  <div style={S.heroOverlay}>
    <div style={S.overlayTitle}>
      {CARS[currentIndex].name}
    </div>
    <div style={S.overlaySub}>
      {formatINR(CARS[currentIndex].pricePerDay)}/day •{" "}
      {CARS[currentIndex].seats} seats •{" "}
      {CARS[currentIndex].transmission}
    </div>
  </div>
</div>

    </section>
  );
}

function Field({ label, children } : { label :string, children :React.ReactNode }) {
  return (
    <div>
      <div style={S.label}>{label}</div>
      {children}
    </div>
  );
}

/* ---------- Styles (Responsive) ---------- */

const S = {
  page: {
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    background: "linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 40%, #F6F8FC 100%)",
    color: "#0B1220",
    minHeight: "100vh",
  },

  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
    flexWrap: "wrap",
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  brandName: { fontWeight: 900, letterSpacing: 0.2 },
  brandTag: { fontSize: 12, color: "rgba(15,23,42,0.6)", marginTop: 2 },

  actions: { display: "flex", gap: 10, flexWrap: "wrap" },

  hero: { padding: "26px 16px 12px" },
  heroInner: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
    alignItems: "start",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.7)",
    boxShadow: "0 10px 22px rgba(15,23,42,0.06)",
    fontSize: 13,
  },

  h1: {
    fontSize: "clamp(30px, 4vw, 44px)",
    lineHeight: 1.1,
    margin: "12px 0 10px",
    letterSpacing: -0.6,
  },
  h1Sub: {
    display: "inline-block",
    marginTop: 8,
    fontSize: "clamp(16px, 2.2vw, 20px)",
    fontWeight: 800,
    color: "rgba(15,23,42,0.75)",
  },

  gradText: {
    background: "linear-gradient(135deg, #00B8FF, #7C7CFF)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },

  sub: {
    fontSize: 16,
    lineHeight: 1.75,
    color: "rgba(15,23,42,0.72)",
    maxWidth: 560,
  },

  heroBtns: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
  trust: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  trustItem: {
    fontSize: 13,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 18px rgba(15,23,42,0.05)",
    color: "rgba(15,23,42,0.78)",
  },

  heroCard: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.90)",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    overflow: "hidden",
  },
  heroCardHead: { padding: 16, borderBottom: "1px solid rgba(15,23,42,0.08)" },
  heroCardTitle: { fontWeight: 900 },
  heroCardSub: { fontSize: 12, color: "rgba(15,23,42,0.55)", marginTop: 4 },
  heroCardBody: { padding: 16, display: "grid", gap: 12 },

  heroImageStrip: {
    maxWidth: 1120,
    margin: "16px auto 0",
    borderRadius: 22,
    overflow: "hidden",
    position: "relative",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 18px 44px rgba(15,23,42,0.10)",
    height: "100%",
    background: "#EAF2FF",
  },
  heroImg: { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay: {
    position: "absolute",
    left: 16,
    bottom: 16,
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(15,23,42,0.08)",
    backdropFilter: "blur(10px)",
  },
  overlayTitle: { fontWeight: 900 },
  overlaySub: { fontSize: 12, color: "rgba(15,23,42,0.7)", marginTop: 3 },

  section: { padding: "34px 16px" },
  sectionHead: { maxWidth: 1120, margin: "0 auto 14px" },
  h2: { margin: 0, fontSize: 26, letterSpacing: -0.3 },
  muted: { margin: "6px 0 0", color: "rgba(15,23,42,0.65)" },
 

  card: {
    borderRadius: 18,
    overflow: "hidden",
    background: "white",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
    transition: "transform 0.15s ease",
  },
  cardImgWrap: { position: "relative", height: 190, background: "#EAF2FF" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  badge: {
    position: "absolute",
    left: 12,
    top: 12,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    color: "#07101F",
    background:
      "linear-gradient(135deg, rgba(0,184,255,0.95), rgba(124,124,255,0.95))",
    boxShadow: "0 12px 24px rgba(0,184,255,0.18)",
  },
  cardBody: { padding: 14, display: "grid", gap: 12 },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  carName: { fontWeight: 900 },
  price: { fontWeight: 900 },
  perDay: { fontSize: 12, color: "rgba(15,23,42,0.6)" },
  meta: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    color: "rgba(15,23,42,0.72)",
    fontSize: 13,
  },

  steps: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  stepCard: {
    borderRadius: 18,
    background: "white",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
    padding: 14,
  },
  stepN: { fontWeight: 900, color: "rgba(15,23,42,0.5)", marginBottom: 8 },
  stepT: { fontWeight: 900, marginBottom: 6 },
  stepD: { color: "rgba(15,23,42,0.68)", fontSize: 13, lineHeight: 1.6 },

  bookingWrap: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 14,
    alignItems: "start",
  },
  form: {
    borderRadius: 18,
    background: "white",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
    padding: 16,
    display: "grid",
    gap: 12,
  },

  row2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  },

  label: { fontSize: 12, fontWeight: 700, color: "rgba(15,23,42,0.7)", marginBottom: 6 },

  input: {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.10)",
    background: "rgba(247,250,255,0.9)",
    outline: "none",
  },

  estimate: {
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(247,250,255,0.9)",
    padding: 12,
    display: "grid",
    gap: 8,
  },
  estimateRow: { display: "flex", justifyContent: "space-between", gap: 10 },
  small: { fontSize: 12, color: "rgba(15,23,42,0.6)" },

  formFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  total: { fontSize: 14, color: "rgba(15,23,42,0.8)" },

  aside: { display: "grid", gap: 12 },
  asideCard: {
    borderRadius: 18,
    background: "white",
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
    padding: 14,
  },
  asideTitle: { fontWeight: 900, marginBottom: 6 },
  asideText: { color: "rgba(15,23,42,0.68)", fontSize: 13, lineHeight: 1.6 },

  primaryBtn: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    color: "white",
    background: "linear-gradient(135deg, #00B8FF, #7C7CFF)",
    boxShadow: "0 14px 30px rgba(0,184,255,0.22)",
  },
  primaryBtnLg: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    color: "white",
    background: "linear-gradient(135deg, #00B8FF, #7C7CFF)",
    boxShadow: "0 14px 30px rgba(0,184,255,0.22)",
  },
  primaryBtnSm: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontWeight: 900,
    color: "white",
    background: "linear-gradient(135deg, #00B8FF, #7C7CFF)",
    boxShadow: "0 14px 30px rgba(0,184,255,0.18)",
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "white",
    cursor: "pointer",
    fontWeight: 800,
    color: "#0B1220",
    boxShadow: "0 12px 24px rgba(15,23,42,0.06)",
  },

  footer: {
    padding: "22px 16px",
    borderTop: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(247,250,255,0.7)",
  },
  footerInner: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  footerTitle: { fontWeight: 900 },
  footerText: { fontSize: 13, color: "rgba(15,23,42,0.65)" },
} as const
