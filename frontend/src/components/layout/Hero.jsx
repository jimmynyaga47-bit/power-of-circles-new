import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">

        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Power of Circles
            <span className="block text-blue-600">
              in Networking Africa
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Connecting businesses, entrepreneurs, investors,
            insurance companies, SACCOs and real estate
            professionals through impactful networking events.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/events"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View Events
            </Link>

            <Link
              to="/contact"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <div className="w-80 h-80 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
            Logo / Hero Image
          </div>
        </div>

      </div>
      
    </section>
  );
}

export default Hero;