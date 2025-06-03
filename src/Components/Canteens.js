import React from "react";
import { Link } from "react-router-dom";

const canteens = [
  {
    name: "Vidhyarthi Canteen Arch. Block",
    location: "Beside Mechanical Block",
    image: "/Canteens/VidhyarthiCanteen.jpg",
    description: "Wide variety of dishes with comfortable seating."
  },

  {
    name: "Vidhyarthi Khana",
    location: "Infront of PJ Block",
    image: "/Canteens/BackSideCanteen.jpg",
    description: "Fast service and delicious meals at affordable prices."
  },
  {
    name: "Cafe Coffee",
    location: "Beside Indoor Stadium",
    image: "/Canteens/Coffee.jpg",
    description: "Cozy lounge with coffee, snacks, and light meals."
  }
];



export default function CanteenPage() {
  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Campus Canteens</h1>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canteens.map((canteen, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">
              <img
                src={canteen.image}
                alt={canteen.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{canteen.name}</h2>
                <p className="text-sm text-gray-600 mb-2">📍 {canteen.location}</p>
                <p className="text-gray-700 mb-4">{canteen.description}</p>
                <Link to='/home' onClick={()=>{
                  sessionStorage.setItem("canteen",canteen.name)
                }} >
                    <button className="w-full bg-red-500 text-white font-medium py-2 rounded-xl transition">
                    View Menu
                    </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
