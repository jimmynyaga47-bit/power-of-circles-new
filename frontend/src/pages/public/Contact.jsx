import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Contact() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: ""
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/cms/settings`)
      .then((r) => setSettings(r.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      setSent(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: "📍", label: "Address", value: settings?.contact_address || "Nairobi, Kenya" },
    { icon: "📞", label: "Phone", value: settings?.contact_phone || "+254 700 123 456" },
    { icon: "✉️", label: "Email", value: settings?.contact_email || "info@powerofcirclesafrika.com" },
    { icon: "🌐", label: "Website", value: "www.powerofcirclesafrika.com" },
  ];

  const socialLinks = [
    { label: "f", url: settings?.facebook },
    { label: "t", url: settings?.twitter },
    { label: "in", url: settings?.linkedin },
    { label: "ig", url: settings?.instagram },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-700 text-white py-24 px-6 text-center">
        <p className="uppercase tracking-widest text-blue-300 text-sm font-semibold mb-3">
          Get In Touch
        </p>
        <h1 className="text-5xl font-extrabold mb-4">Contact Us</h1>
        <p className="text-blue-200 text-xl max-w-xl mx-auto">
          We'd love to hear from you. Reach out for partnerships, sponsorships, or event enquiries.
        </p>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Let's Connect</h2>
            <div className="space-y-6">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-xl text-white flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-gray-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="font-bold text-gray-900 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a key={s.label}
                    href={s.url || "#"}
                    target={s.url ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold hover:bg-blue-600 transition">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                  }}
                  className="bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input name="name" value={form.name} onChange={handleChange}
                        required placeholder="John Doe"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone
                      </label>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+254 700 000 000"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={form.email}
                      onChange={handleChange} required placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                    <select name="subject" value={form.subject}
                      onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select a subject</option>
                      <option>Event Registration</option>
                      <option>Sponsorship Enquiry</option>
                      <option>Partnership</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                    <textarea name="message" value={form.message}
                      onChange={handleChange} required rows={5}
                      placeholder="Your message here..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition disabled:opacity-60">
                    {loading ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;