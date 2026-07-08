import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
<div className="w-14 h-14 rounded-full bg-white shadow-md overflow-hidden">
  <img
    src="/Logo.jpeg"
    alt="Power of Circles Networking Africa"
    className="w-full h-full object-cover"
  />
</div>

          <div>
            <h1
              className={`font-bold text-xl transition-colors duration-300 ${
                scrolled ? "text-blue-700" : "text-white"
              }`}
            >
              Power of Circles
            </h1>

            <p
              className={`text-sm transition-colors duration-300 ${
                scrolled ? "text-gray-500" : "text-blue-200"
              }`}
            >
              Networking Africa
            </p>
          </div>

        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">

          {[
            ["Home", "/"],
            ["About", "/about"],
            ["Events", "/events"],
            ["Contact", "/contact"],
          ].map(([name, path]) => (
            <Link
              key={name}
              to={path}
              className={`relative font-medium transition-all duration-300
              after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0
              after:bg-blue-600 after:transition-all after:duration-300
              hover:after:w-full
              ${
                scrolled
                  ? "text-gray-700 hover:text-blue-600"
                  : "text-white hover:text-blue-300"
              }`}
            >
              {name}
            </Link>
          ))}

        </nav>

        {/* Register Button */}
        <Link
          to="/events"
          className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-white px-6 py-3 rounded-full font-semibold"
        >
          Register Now
        </Link>

      </div>
    </header>
  );
}

export default Navbar;