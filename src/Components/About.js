import React from 'react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">About Cafe BMSCE</h1>
        <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto">
          Where coffee meets campus culture – your daily dose of delight inside BMS College of Engineering.
        </p>

        {/* Image Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Cafe ambiance"
            className="w-full rounded-xl shadow-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">A Place to Unwind, Refuel, and Connect</h2>
            <p className="text-gray-600 mb-4">
              Nestled in the heart of BMSCE, our cafe is more than just a place to grab a bite—it's a hub of energy,
              laughter, and inspiration. From early morning brews to post-class snacks, Cafe BMSCE has become a
              cherished part of student life.
            </p>
            <p className="text-gray-600">
              Whether you're brainstorming your next big idea, catching up with friends, or simply recharging with a
              cup of coffee, we’ve got the perfect corner waiting for you.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
          <p className="text-gray-600">
            At Cafe BMSCE, our mission is to create a welcoming space that fuels both body and mind. We serve high-quality,
            affordable meals crafted with care—because you deserve the best, even on a student budget.
          </p>
        </div>

        {/* Highlights */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Fresh & Affordable</h4>
            <p className="text-gray-600">Daily-made dishes using quality ingredients at student-friendly prices.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">For the Campus</h4>
            <p className="text-gray-600">Serving the BMSCE community with warmth, speed, and consistency.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Open & Welcoming</h4>
            <p className="text-gray-600">A space where ideas, friendships, and creativity bloom over chai and snacks.</p>
          </div>
        </div>

        {/* Footer quote */}
        <div className="mt-20 text-center">
          <blockquote className="text-xl italic text-gray-500">
            “Cafe BMSCE isn’t just a cafe, it’s an experience—brewed to perfection, served with passion.”
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
