import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Footer() {
  const [settings, setSettings] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    axios.get(`${API}/cms/settings`).then((r) => setSettings(r.data)).catch(console.error);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setSubscribing(true);
    try {
      const res = await axios.post(`${API}/newsletter/subscribe`, {
        email: newsletterEmail,
      });
      alert(res.data.message || "Subscribed successfully!");
      setNewsletterEmail("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to subscribe. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">POWER OF CIRCLES</h3>
          <p className="text-blue-400 text-xs mb-4">IN NETWORKING AFRICA</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {settings?.footer_text ||
              "Connecting leaders, building partnerships and creating opportunities across Africa."}
          </p>
          <div className="flex gap-3">
            {[
              { label: "f", url: settings?.facebook },
              { label: "t", url: settings?.twitter },
              { label: "in", url: settings?.linkedin },
              { label: "ig", url: settings?.instagram },
            ].map((s) => (
              <a key={s.label} href={s.url || "#"}
                target={s.url ? "_blank" : "_self"}
                rel="noreferrer"
                className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-xs font-bold hover:bg-blue-500 transition">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">QUICK LINKS</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            {[["Home", "/"], ["About Us", "/about"], ["Events", "/events"], ["Program", "/program"], ["Contact", "/contact"]].map(([name, path]) => (
              <li key={name}>
                <Link to={path} className="hover:text-blue-400 transition">{name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">CONTACT US</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>📍 {settings?.contact_address || "Nairobi, Kenya"}</li>
            <li>📞 {settings?.contact_phone || "+254 700 123 456"}</li>
            <li>✉️ {settings?.contact_email || "info@powerofcirclesinnetworking.com"}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">NEWSLETTER</h4>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to get updates on our upcoming events and news.
          </p>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              placeholder="Your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none" />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-r-lg text-sm transition disabled:opacity-50">
              {subscribing ? "..." : "SUBSCRIBE"}
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-6 max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <span>© 2026 Power of Circles in Networking Africa. All Rights Reserved.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-blue-400">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;