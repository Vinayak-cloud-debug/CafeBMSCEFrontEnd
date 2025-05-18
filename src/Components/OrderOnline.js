import React from 'react';




const OrderOnline = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-red-600">Order Online</h1>
      <p className="text-center max-w-xl mx-auto mb-10 text-gray-600">
        Browse our delicious menu and place your order online. Fresh, fast, and delivered with love from Cafe BMSCE.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((_, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
            <img
              src={`https://source.unsplash.com/400x300/?food,${idx}`}
              alt="Food Item"
              className="rounded-md w-full h-48 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">Delicious Dish #{idx + 1}</h2>
            <p className="text-gray-600 text-sm mt-2">Tasty description of this menu item. Perfectly made to satisfy your cravings.</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-green-600">₹{99 + idx * 20}</span>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderOnline;
