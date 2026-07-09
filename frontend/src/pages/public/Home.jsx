import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Home() {
  const [settings, setSettings] = useState(null);
  const [homepage, setHomepage] = useState(null);
  const [events, setEvents] = useState([]);
  const [founders, setFounders] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get(`${API}/cms/settings`).then((r) => setSettings(r.data)).catch(console.error);
    axios.get(`${API}/homepage`).then((r) => setHomepage(r.data)).catch(console.error);
    axios.get(`${API}/events`).then((r) => setEvents(r.data.events?.slice(0, 3) || [])).catch(console.error);
    axios.get(`${API}/cms/founders`).then((r) => setFounders(r.data)).catch(console.error);
    axios.get(`${API}/cms/sponsors`).then((r) => setSponsors(r.data)).catch(console.error);
    axios.get(`${API}/cms/testimonials`).then((r) => setTestimonials(r.data)).catch(console.error);
  }, []);

  const stats = [
    { icon: "📅", value: "50+", label: "Events Hosted" },
    { icon: "👥", value: "5,000+", label: "Professionals Connected" },
    { icon: "🏢", value: "300+", label: "Companies Represented" },
    { icon: "🤝", value: "20+", label: "Strategic Partners" },
  ];

  const reasons = [
    { icon: "👥", title: "Quality Networking", desc: "We connect you with the right people and opportunities that drive real results." },
    { icon: "📈", title: "Business Growth", desc: "Our events are designed to help you expand your network and grow your business." },
    { icon: "💡", title: "Knowledge Sharing", desc: "Gain insights from industry experts and thought leaders across various sectors." },
    { icon: "🤝", title: "Strategic Partnerships", desc: "Build long-term partnerships that create value and drive collective impact." },
  ];

  return (
    <div className="font-sans">

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: settings?.hero_image
            ? `url(${settings.hero_image})`
            : "linear-gradient(135deg, #0a1628 0%, #1565C0 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
          <span className="inline-flex items-center gap-2 border border-blue-400 text-blue-300 text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-widest mb-6">
            CONNECT • NETWORK • GROW
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
            {settings?.hero_title || "POWER OF CIRCLES"}
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl mb-10 leading-relaxed">
            {settings?.hero_subtitle || "Connecting leaders, entrepreneurs, investors and professionals through impactful networking events across Africa."}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/events"
              className="bg-white text-blue-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-lg">
              🎟️ {settings?.hero_button_text || "Register Now"}
            </Link>
            <Link to="/events"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white hover:text-blue-900 transition">
              📅 View Events
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white text-2xl">↓</div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-blue-700 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-4xl font-extrabold">{s.value}</div>
              <div className="text-blue-200 mt-1 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WELCOME (managed from Content Management → Homepage) ── */}
      {(homepage?.welcome_title || homepage?.welcome_message) && (
        <section className="py-16 bg-white text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {homepage?.welcome_title || "Welcome to Power Of Circles"}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {homepage?.welcome_message}
            </p>
          </div>
        </section>
      )}

      {/* ── ABOUT + UPCOMING EVENTS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          {/* About */}
          <div>
            <div className="h-72 bg-blue-200 rounded-2xl flex items-center justify-center text-blue-400 text-lg font-semibold mb-6 shadow">
              📸 Company Photo
            </div>
            <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">
              ABOUT US
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              {settings?.about_title || "Who We Are"}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {settings?.about_text ||
                "Power of Circles in Networking Africa is a premier platform that brings together dynamic minds, industry leaders, and change makers to connect, collaborate and create sustainable opportunities."}
            </p>
            <Link to="/about"
              className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition">
              LEARN MORE ABOUT US →
            </Link>
          </div>

          {/* Upcoming Events */}
          <div>
            <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">
              UPCOMING EVENTS
            </span>
            <div className="flex items-center justify-between mt-2 mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
              <Link to="/events" className="text-blue-600 text-sm font-semibold hover:underline">
                View all →
              </Link>
            </div>
            {events.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow">
                <p className="text-3xl mb-2">📅</p>
                <p>No upcoming events yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id}
                    className="flex items-center gap-4 bg-white rounded-xl p-4 shadow hover:shadow-md transition">
                    <div className="bg-blue-900 text-white rounded-lg p-3 text-center min-w-[64px]">
                      <div className="text-xs font-semibold">
                        {event.date ? new Date(event.date).toLocaleString("en-KE", { month: "short" }).toUpperCase() : "TBD"}
                      </div>
                      <div className="text-2xl font-extrabold leading-none">
                        {event.date ? new Date(event.date).getDate() : "—"}
                      </div>
                      <div className="text-xs">
                        {event.date ? new Date(event.date).getFullYear() : ""}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm">{event.name}</h3>
                      <p className="text-gray-500 text-xs mt-1">📍 {event.venue || "TBD"}</p>
                    </div>
                    <Link to={`/events/${event.id}/buy`}
                      className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      REGISTER
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">
            WHY CHOOSE US
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-2">
            The Power Behind Every Connection
          </h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {reasons.map((r) => (
              <div key={r.title}
                className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition border border-gray-100">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-4">
                  {r.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">
              WHAT PEOPLE SAY
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-12">
              Voices From Our Community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="bg-white rounded-2xl p-8 shadow text-left hover:shadow-lg transition">
                  <div className="text-blue-600 text-4xl font-serif mb-4">"</div>
                  <p className="text-gray-600 leading-relaxed mb-6">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.name}
                        className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {t.name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-blue-600 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SPONSORS ── */}
      {sponsors.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">
              OUR PARTNERS
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-10">Our Sponsors</h2>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {sponsors.map((s) => (
                <a key={s.id} href={s.website || "#"}
                  target={s.website ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="h-16 px-6 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-blue-50 transition">
                  {s.logo_url ? (
                    <img src={s.logo_url} alt={s.name} className="h-10 object-contain" />
                  ) : (
                    <span className="text-gray-600 font-bold text-sm">{s.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;