import React, { useState } from 'react';

const Reservation = () => {
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    guests: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert(`Reservation made for ${form.name} on ${form.date} at ${form.time} for ${form.guests} guest(s).`);
    setForm({ name: '', date: '', time: '', guests: '' });
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Reserve a Table</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-gray-100 p-8 rounded-xl shadow-md space-y-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full p-3 rounded-lg border border-gray-300"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300"
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300"
        />
        <input
          type="number"
          name="guests"
          value={form.guests}
          onChange={handleChange}
          placeholder="Number of Guests"
          required
          className="w-full p-3 rounded-lg border border-gray-300"
        />
        <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Reservation;
