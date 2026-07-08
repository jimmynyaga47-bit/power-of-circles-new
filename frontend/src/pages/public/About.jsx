import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function About() {
  const [settings, setSettings] = useState(null);
  const [founders, setFounders] = useState([]);

  useEffect(() => {
    axios.get(`${API}/cms/settings`).then((r) => setSettings(r.data)).catch(console.error);
    axios.get(`${API}/cms/founders`).then((r) => setFounders(r.data)).catch(console.error);
  }, []);

  const values = [
    { icon: "🤝", title: "Integrity", desc: "We operate with transparency and honesty in all our dealings." },
    { icon: "🌍", title: "Pan-African Vision", desc: "We believe in the power of African professionals connecting across borders." },
    { icon: "💡", title: "Innovation", desc: "We continuously evolve our events to deliver maximum value." },
    { icon: "🎯", title: "Excellence", desc: "We set the highest standards in every event we organize." },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-700 text-white py-24 px-6 text-center">
        <p className="uppercase tracking-widest text-blue-300 text-sm font-semibold mb-3">About Us</p>
        <h1 className="text-5xl font-extrabold mb-4">
          {settings?.about_title || "Who We Are"}
        </h1>
        <p className="text-blue-200 text-xl max-w-2xl mx-auto leading-relaxed">
          {settings?.about_text ||
            "Power of Circles in Networking Africa Ltd is Kenya's premier professional networking company."}
        </p>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="h-80 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-400 text-lg font-semibold shadow">
            📸 Company Photo
          </div>
          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm">Our Story</p>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
              Connecting Businesses, Inspiring Growth
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {settings?.about_text ||
                "Power of Circles in Networking Africa was founded with a simple but powerful vision: to create a platform where real estate companies, insurance firms, SACCOs and business professionals could connect, collaborate, and grow together."}
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              What started as a small networking gathering has grown into Kenya's most respected
              professional networking platform, hosting over 50 events and connecting more than
              5,000 professionals across Africa.
            </p>
            <Link to="/events"
              className="inline-block bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
              View Our Events →
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="bg-blue-700 text-white rounded-2xl p-10">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="leading-relaxed text-blue-100">
              To connect professionals across Kenya and Africa through world-class networking
              events that foster meaningful relationships, business growth, and collective impact.
            </p>
          </div>
          <div className="bg-gray-900 text-white rounded-2xl p-10">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="leading-relaxed text-gray-300">
              To become Africa's largest and most impactful professional networking platform,
              empowering businesses and individuals to achieve their full potential through
              the power of connections.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm">
            What We Stand For
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title}
                className="p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm">The Team</p>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-12">Meet Our Founders</h2>
          {founders.length === 0 ? (
            <p className="text-gray-400">Founders information coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {founders.map((f) => (
                <div key={f.id}
                  className="bg-white rounded-2xl shadow p-8 text-center hover:shadow-lg transition">
                  {f.photo_url ? (
                    <img src={f.photo_url} alt={f.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100" />
                  ) : (
                    <div className="w-24 h-24 bg-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                      {f.name?.[0]}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{f.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-3">{f.title}</p>
                  {f.bio && <p className="text-gray-500 text-sm leading-relaxed mb-3">{f.bio}</p>}
                  {f.quote && (
                    <p className="text-gray-400 text-xs italic">"{f.quote}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Join Our Network?</h2>
        <p className="text-blue-200 text-lg mb-8">
          Register for our next event and start building powerful connections.
        </p>
        <Link to="/events"
          className="inline-block bg-white text-blue-700 font-bold px-10 py-4 rounded-full text-lg hover:bg-blue-50 transition">
          View Upcoming Events →
        </Link>
      </section>
    </div>
  );
}

export default About;