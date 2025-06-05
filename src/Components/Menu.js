

import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function AdminPage() {
  const { userData } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [gender, setGender] = useState("");
  const [orders, setOrders] = useState([]);
  const [editedStatuses, setEditedStatuses] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Password protection states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  // Filtering and display states
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedUsers, setExpandedUsers] = useState({});
  const [compactView, setCompactView] = useState(true);

  const ADMIN_PASSWORD = "BullMarket@12";
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      const fname = localStorage.getItem("FullName");
      const mailId = localStorage.getItem("EmailId");
      const gend = localStorage.getItem("Gender");
      setFullName(fname);
      setEmailId(mailId);
      setGender(gend);
      setIsLoading(false);
    }, 3000);
  }, [userData]);

  const email = localStorage.getItem("EmailId");

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const res = await axios.get(`https://cafebmscebackend.onrender.com/api/fetchUserOrders`);
          console.log(res.data);
          setOrders(res.data);
          
          // Initialize editedStatuses with current order statuses
          const initialStatuses = {};
          res.data.forEach(user => {
            user.orders.forEach(order => {
              initialStatuses[order._id] = order.status;
            });
          });
          setEditedStatuses(initialStatuses);

          // Auto-expand users with orders
          const initialExpanded = {};
          res.data.forEach(user => {
            if (user.orders.length > 0) {
              initialExpanded[user._id] = true;
            }
          });
          setExpandedUsers(initialExpanded);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
          alert("Failed to fetch orders. Please try again.");
        }
      };
      fetchOrders();
    }
  }, [location.pathname, isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsCheckingPassword(true);
    setPasswordError("");

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setPasswordError("Incorrect password. Please try again.");
        setPassword("");
      }
      setIsCheckingPassword(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setPasswordError("");
    setOrders([]);
    setEditedStatuses({});
    setExpandedUsers({});
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setEditedStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  // Filter orders based on status
  const getFilteredOrders = (userOrders) => {
    if (statusFilter === 'all') return userOrders;
    return userOrders.filter(order => order.status === statusFilter);
  };

  // Get order counts by status for a user
  const getOrderCounts = (userOrders) => {
    const counts = {
      all: userOrders.length,
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    
    userOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    
    return counts;
  };

  const updateAllStatuses = async () => {
    const updates = [];
    
    orders.forEach(user => {
      user.orders.forEach(order => {
        if (editedStatuses[order._id] && editedStatuses[order._id] !== order.status) {
          updates.push({
            orders: order,
            fullName: user.fullName,
            email: user.username,
            orderId: order._id,
            newStatus: editedStatuses[order._id]
          });
        }
      });
    });

    if (updates.length === 0) {
      alert("No changes to save.");
      return;
    }

    setIsUpdating(true);
    
    try {
      const updatePromises = updates.map(({orders, fullName, email, orderId, newStatus }) =>
        axios.put(`https://cafebmscebackend.onrender.com/api/updateOrderStatus`, {
          orders,
          fullName,
          email,
          orderId,
          status: newStatus
        })
      );

      await Promise.all(updatePromises);

      const updatedOrders = orders.map(user => ({
        ...user,
        orders: user.orders.map(order => ({
          ...order,
          status: editedStatuses[order._id] || order.status
        }))
      }));
      
      setOrders(updatedOrders);
      alert(`Successfully updated ${updates.length} order status(es)!`);
      
    } catch (error) {
      console.error("Error updating statuses:", error);
      alert("Failed to update order status. Please try again.");
      
      const revertedStatuses = {};
      orders.forEach(user => {
        user.orders.forEach(order => {
          revertedStatuses[order._id] = order.status;
        });
      });
      setEditedStatuses(revertedStatuses);
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading screen
  if (isLoading || !fullName) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex justify-center items-center mb-4 p-4 bg-red-100 rounded-full">
              <Lock size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
            <p className="text-gray-600 text-sm">
              Please enter the admin password to access the panel
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                disabled={isCheckingPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isCheckingPassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {passwordError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              disabled={isCheckingPassword || !password.trim()}
              className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                isCheckingPassword || !password.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 active:scale-95'
              } text-white`}
            >
              {isCheckingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                  Verifying...
                </>
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Authorized personnel only
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="min-h-screen bg-orange-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel - Order Management</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Filter Controls */}
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* View Toggle */}
              <button
                onClick={() => setCompactView(!compactView)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition duration-200"
              >
                {compactView ? 'Detailed View' : 'Compact View'}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 bg-white rounded-lg p-8">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((user) => {
              const filteredOrders = getFilteredOrders(user.orders);
              const orderCounts = getOrderCounts(user.orders);
              const isExpanded = expandedUsers[user._id];

              if (filteredOrders.length === 0 && statusFilter !== 'all') {
                return null; // Hide users with no orders matching filter
              }

              return (
                <div key={user._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* User Header */}
                  <div 
                    className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => toggleUserExpansion(user._id)}
                  >
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User size={32} className="text-red-600" />
                        <div>
                          <h3 className="font-semibold text-gray-800">{user.fullName}</h3>
                          <p className="text-sm text-gray-600">{user.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Order Status Summary */}
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                            Pending: {orderCounts.pending}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            Shipped: {orderCounts.shipped}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                            Delivered: {orderCounts.delivered}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                            Cancelled: {orderCounts.cancelled}
                          </span>
                        </div>
                        
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Orders List */}
                  {isExpanded && (
                    <div className="p-4">
                      {filteredOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No orders found for this status.</p>
                      ) : (
                        <div className="space-y-3">
                          {filteredOrders.map((order, idx) => (
                            <div key={order._id || idx} className={`border rounded-lg p-3 ${compactView ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                {/* Order Info */}
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="font-medium text-red-600">Order #{idx + 1}</span>
                                    <span className="text-xs text-gray-500 font-mono">{order._id}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {order.status}
                                    </span>
                                    {editedStatuses[order._id] !== order.status && (
                                      <span className="text-xs text-orange-600 font-medium">* Modified</span>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span>₹{order.totalAmount}</span>
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span>{order.items.length} items</span>
                                  </div>
                                </div>

                                {/* Status Change */}
                                <div className="flex items-center gap-2">
                                  <select
                                    value={editedStatuses[order._id] || order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={isUpdating}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </div>

                              {/* Order Items (shown in detailed view) */}
                              {!compactView && (
                                <div className="mt-3 pt-3 border-t">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {order.items.map((item, i) => (
                                      <div key={i} className="flex items-center gap-2 p-2 bg-white rounded border">
                                        {item.imgUrl && (
                                          <img
                                            src={item.imgUrl}
                                            alt={item.name}
                                            className="w-8 h-8 object-cover rounded"
                                          />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium truncate">{item.name}</p>
                                          <p className="text-xs text-gray-500">
                                            {item.quantity} × ₹{item.price}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Save Button */}
      {Object.keys(editedStatuses).some(orderId => 
        orders.some(user => 
          user.orders.some(order => 
            order._id === orderId && editedStatuses[orderId] !== order.status
          )
        )
      ) && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={updateAllStatuses}
            disabled={isUpdating}
            className={`px-6 py-3 font-semibold rounded-full flex items-center gap-2 shadow-lg transition duration-200 ${
              isUpdating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:scale-95'
            } text-white`}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      )}
    </div>
  );
}


// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//     setMenuList, 
//     setBreakFast, 
//     setLunch, 
//     setDinner, 
//     setDessert, 
//     setDrink, 
//     setUserCart, 
//     setCounter, 
//     setCartStatus,
//     setLoginStatus,
//     setSignUpStatus,
//     setNoodles
    
// } from '../redux/actions/index';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Login from '../pages/Login/login';
// import { set } from 'lodash';
// import { useAuthContext } from '../context/AuthContext';
// import Logout from '../pages/LogOut/Logout';
// import toast, { Toaster } from 'react-hot-toast';

// function Menu() {
//   const dispatch = useDispatch();

//   const {authUser} = useAuthContext();
//   console.log(authUser)

//   const {
//     breakFast,
//     lunch,
//     dinner,
//     dessert,
//     drink,
//     userCart,
//     menuList,
//     counter,
//     noodles
    
//   } = useSelector(state => state);

//   // Search state
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredMenuList, setFilteredMenuList] = useState([]);

//   // Reset all category flags to 0
//   const resetCategories = () => {
//     dispatch(setBreakFast(0));
//     dispatch(setLunch(0));
//     dispatch(setDinner(0));
//     dispatch(setDrink(0));
//     dispatch(setDessert(0));
//     dispatch(setNoodles(0));
//   };

//   // Filter menu items based on search query using regex
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredMenuList(menuList);
//       return;
//     }

//     try {
//       const regex = new RegExp(searchQuery.trim(), 'i'); // Case insensitive search
//       const filtered = menuList.filter(item => 
//         regex.test(item.Name) || 
//         regex.test(item.Description) ||
//         regex.test(item.Category)
//       );
//       setFilteredMenuList(filtered);
//     } catch (error) {
//       // If regex is invalid, fall back to simple string matching
//       const filtered = menuList.filter(item => 
//         item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.Description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredMenuList(filtered);
//     }
//   }, [searchQuery, menuList]);

//   useEffect(() => {
//   axios.get("https://cafebmscebackend.onrender.com/api/GetAllFoodItems")
//     .then(response => {

//       setTimeout(()=>{

//         const updatedMenuList = response.data.map(Item => {
//         const CartItem = userCart.find(cartItem => cartItem.Name === Item.Name);
//         return CartItem ? { ...Item, qty: CartItem.qty } : { ...Item, qty: 0 };
//       });
//       dispatch(setMenuList(updatedMenuList));
//       },1500)
      
//     })
//     .catch(err => console.log(err));
// }, []); // <--- add userCart as a dependency

//   const [nashta,setNashta] = useState(false);
//   const [oota,setOota] = useState(false);
//   const [nightOota,setNightOota] = useState(false);
//   const [drinks,setDrinks] = useState(false);
//   const [icecream,setIcecream] = useState(false);
//   const [noodle,setNoodle] = useState(false)

//   const handleClick = (index) => {

//     switch (index) {
//       case 1:
        
//         dispatch(setBreakFast(1));
//         break;
//       case 2:
//         dispatch(setLunch(2));
//         break;
//       case 3:
//         dispatch(setDinner(3));
//         break;
//       case 4:
//         dispatch(setDrink(4));
//         break;
//       case 5:
//         dispatch(setDessert(5));
//         break;
//       case 6:
//         dispatch(setNoodles(6));
//       default:
//         break;
//     }

//     const categories = ["Breakfast", "lunch", "Dinner", "Drink", "Dessert","Noodles"];
//     const selectedCategory = categories[index - 1];

//     if (selectedCategory) {
      
//      dispatch(setMenuList([]));

//       axios.post("https://cafebmscebackend.onrender.com/api/GetFoodItemsByCategory", { SelectedCategory: selectedCategory })
//         .then(response => {

//           setTimeout(()=>{

//             const updatedMenuList = response.data.map(Item => {
//             const CartItem = userCart.find(cartItem => cartItem.Name === Item.Name);
//             return CartItem ? { ...Item, qty: CartItem.qty } : { ...Item, qty: 0 };
//           });
          
//           dispatch(setMenuList(updatedMenuList));
//           },1500)
          
//         })
//         .catch(err => console.log(err));
//     }
//   };

//   const AddItem = (Food) => {

//     if(authUser == null){
//       toast.error('Login to Order your Dishes')
//       return;
//     }

//   if (!breakFast && !lunch && !dinner && !dessert && !drinks && !noodle) {
//     alert("Select the Food Category");
//     return;
//   }

//   const existingCartItem = userCart.find(item => item.Name === Food.Name);

//   if (existingCartItem) {
//     IncrementQty(Food);
//   } else {
//     const updatedFood = { ...Food, qty: 1 };
//     const updatedMenuList = menuList.map(item => 
//       item.Name === Food.Name ? updatedFood : item
//     );
    
//     dispatch(setMenuList(updatedMenuList));
//     dispatch(setUserCart([...userCart, updatedFood]));
//     dispatch(setCounter(counter + 1));
//   }
// };

// const IncrementQty = (Food) => {
//   if (!breakFast && !lunch && !dinner && !dessert && !drink && !noodle) {
//     alert("Select the Food Category");
//     return;
//   }

//   const updatedMenuList = menuList.map(item =>
//     item.Name === Food.Name ? { ...item, qty: item.qty + 1 } : item
//   );
//   dispatch(setMenuList(updatedMenuList));

//   const existingCartItem = userCart.find(item => item.Name === Food.Name);
//   if (existingCartItem) {
//     const updatedCart = userCart.map(item =>
//       item.Name === Food.Name ? { ...item, qty: item.qty + 1 } : item
//     );
//     dispatch(setUserCart(updatedCart));
//   } else {
//     dispatch(setUserCart([...userCart, { ...Food, qty: 1 }]));
//     dispatch(setCounter(counter + 1));
//   }
// };

// const DecrementQty = (Food) => {
//   if (!breakFast && !lunch && !dinner && !dessert && !drink && !noodle) {
//     alert("Select the Food Category");
//     return;
//   }

//   if (Food.qty > 0) {
//     const updatedMenuList = menuList.map(item =>
//       item.Name === Food.Name ? { ...item, qty: item.qty - 1 } : item
//     );
//     dispatch(setMenuList(updatedMenuList));

//     if (Food.qty === 1) {
//       const updatedCart = userCart.filter(item => item.Name !== Food.Name);
//       dispatch(setUserCart(updatedCart));
//       dispatch(setCounter(counter - 1));
//     } else {
//       const updatedCart = userCart.map(item =>
//         item.Name === Food.Name ? { ...item, qty: item.qty - 1 } : item
//       );
//       dispatch(setUserCart(updatedCart));
//     }
//   }
// };

//   // Fix whitespace in returned class names, add responsive text size
//   const getCategoryStyle = (isActive) => 
//     `block px-4 py-2 text-xl sm:text-2xl cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
//       isActive ? 'bg-red-500 text-white' : 'bg-transparent hover:bg-red-100'
//     }`;

//   const Checkout = () => {
//     navigate("/cart");
//   };

//   const navigate = useNavigate();

//   const About = () => {
//     navigate("/About");
//   }
//   const OrderOnline = () => {
//     navigate("/OrderOnline");
//   }
//   const Reservation = () => {
//     navigate("/Reservation");
//   }
//   const ContactUs = () => {
//     navigate("/ContactUs");
//   }

//   const cname = sessionStorage.getItem('canteen')
//   const [canteenName,setCanteenName] = useState(cname)
//   const [login,setLogin] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);

//   return (
//     <div className='bg-orange-50 min-h-screen flex flex-col gap-12 px-4 sm:px-8 relative'>

//     {authUser === null && !login? 
//       <div 
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       // clicking outside closes modal
//     >

//       <div 
//         className="relative z-60  rounded-lg p-6 w-full max-w-md"
        
//       >
//         {/* Close button */}
//         <button
//           onClick={() => setLogin(!login)}
//           className="absolute top-64 right-16 lg:top-44 lg:right-16 text-red-700 hover:text-gray-900 text-2xl font-bold"
//           aria-label="Close modal"
//         >
//           &times;
//         </button>

//         <Login />
//       </div>
//     </div>
//     :null}

//   <div className='flex flex-wrap items-center justify-between py-6'>
//     <div className='flex flex-row items-center gap-8'>
//       <div className='text-2xl sm:text-3xl font-medium bg-red-500 h-16 w-16 sm:h-[90px] sm:w-[90px] rounded-full flex justify-center items-center text-white transform -rotate-12'>
//         Cafe
//       </div>
//       <h1 className='text-2xl sm:text-3xl font-bold'>BMSCE<span className='text-red-600'>.</span></h1>
//       <div className='flex flex-wrap gap-6 text-sm sm:text-lg mt-4 sm:mt-0'>
//       <span onClick={About} className='cursor-pointer text-base lg:text-lg -mt-3 lg:-mt-0 font-semibold hover:text-orange-500'>About us</span>
//       <span onClick={ContactUs} className='cursor-pointer text-base lg:text-lg -mt-3 lg:-mt-0 font-semibold hover:text-orange-500'>Contact Us</span>
//     </div>
//     </div>

//     <div className='flex items-center gap-4 mt-4 sm:mt-0'>

//       {authUser === null ? 
//       <div 
//         onClick={() => setLogin(!login)} 
//         className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-3xl cursor-pointer shadow-lg hover:from-red-600 hover:to-red-700 transition duration-300 ease-in-out flex items-center justify-center select-none"
//       >
//         <h1 className="text-sm sm:text-base font-semibold tracking-wide drop-shadow-sm">
//           Log in
//         </h1>
//       </div>

// :
//   <div className='flex flex-wrap gap-5'>
//  <div onClick={Checkout} className='text-xl sm:text-2xl bg-white h-10 w-10 sm:h-[60px] sm:w-[60px] rounded-full flex justify-center items-center cursor-pointer'>
//         <svg
//   xmlns="http://www.w3.org/2000/svg"
//   fill="currentColor"
//   viewBox="0 0 16 16"
//   className="w-6 h-6"
// >
//   <path d="M0 1a1 1 0 0 1 1-1h1.5a.5.5 0 0 1 .485.379L3.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.402L1.61 1.607 1.11 0H1a1 1 0 0 1-1-1zm3.14 3l1.25 6h8.197l1.2-5.6H4.89L3.14 3zM5.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
// </svg>

//     </div>

// <div 
//   onClick={()=>navigate('/MyProfile')}
//   className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-3xl cursor-pointer shadow-lg hover:from-red-600 hover:to-red-700 transition duration-300 ease-in-out flex items-center justify-center select-none"
// >
//   <h1 className="text-sm sm:text-base font-semibold tracking-wide drop-shadow-sm">
//     My Profile
//   </h1>
// </div>

// <Logout/>
//     </div>
// }

//     </div>
//   </div>

//   {/* Title */}
//   <h1 className='text-3xl sm:text-5xl font-bold text-center'>Welcome to {canteenName}'s Menu</h1>

//   {/* Search Bar */}
//   <div className='flex justify-center'>
//     <div className='relative w-full max-w-md'>
//       <input
//         type="text"
//         placeholder="Search for dishes, ingredients, or categories..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className='w-full px-4 py-3 pr-12 text-lg border-2 border-red-200 rounded-full focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 shadow-sm'
//       />
//       <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
//         <svg 
//           xmlns="http://www.w3.org/2000/svg" 
//           className="h-6 w-6 text-red-400" 
//           fill="none" 
//           viewBox="0 0 24 24" 
//           stroke="currentColor"
//         >
//           <path 
//             strokeLinecap="round" 
//             strokeLinejoin="round" 
//             strokeWidth={2} 
//             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
//           />
//         </svg>
//       </div>
//       {searchQuery && (
//         <button
//           onClick={() => setSearchQuery('')}
//           className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             className="h-5 w-5" 
//             viewBox="0 0 20 20" 
//             fill="currentColor"
//           >
//             <path 
//               fillRule="evenodd" 
//               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
//               clipRule="evenodd" 
//             />
//           </svg>
//         </button>
//       )}
//     </div>
//   </div>


//  {(!nashta && !oota && !nightOota && !icecream && !noodle && !drinks)?

//     <h2 className='font-medium text-lg'>Select Your Dish Category from Menu Icon </h2>
//   :
//   (nashta && !oota && !nightOota && !icecream && !noodle && !drinks)?
//   <h2 className='font-medium text-lg'>Here are you Breakfast Dishes </h2>
//   :

//     (!nashta && oota && !nightOota && !icecream && !noodle && !drinks)?
//     <h2 className='font-medium text-lg'>Here are you Lunch </h2>
//   :

//       (!nashta && !oota && nightOota && !icecream && !noodle && !drinks)?
//       <h2 className='font-medium text-lg'>Here are your Dinner </h2>
//   :

//         (!nashta && !oota && !nightOota && icecream && !noodle && !drinks)?
//         <h2 className='font-medium text-lg'>Here are your Delicious Icecreams </h2>
//   :

//           (!nashta && !oota && !nightOota && !icecream && noodle && !drinks)?
//           <h2 className='font-medium text-lg'>Here are you Noodles </h2>
//   :

//             (!nashta && !oota && !nightOota && !icecream && !noodle && drinks)?
//             <h2 className='font-medium text-lg'>Here are your Drinks </h2>
//   :null

            
//   }

//   {/* Search Results Info */}
//   {searchQuery && (
//     <div className='text-center text-gray-600'>
//       {filteredMenuList.length > 0 
//         ? `Found ${filteredMenuList.length} item${filteredMenuList.length !== 1 ? 's' : ''} for "${searchQuery}"`
//         : `No items found for "${searchQuery}"`
//       }
//     </div>
//   )}

//   <div className="fixed bottom-20 right-6 z-50">
//   {/* Floating Toggle Button */}
//   <button
//     onClick={() => setShowMobileMenu(prev => !prev)}
//     className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 active:scale-95 transition duration-200"
//     aria-label="Open category menu"
//   >
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
//   <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
// </svg>
//   </button>

//   {/* Dropdown Menu */}
//   {showMobileMenu && (
//     <div className="absolute bottom-16 right-0 bg-black text-white rounded-lg shadow-2xl p-2 w-40 flex flex-col space-y-1 animate-fade-in">
//       {[
//         { label: 'Breakfast', state: [true, false, false, false, false, false], click: 1 },
//         { label: 'Lunch', state: [false, true, false, false, false, false], click: 2 },
//         { label: 'Dinner', state: [false, false, true, false, false, false], click: 3 },
//         { label: 'Drinks', state: [false, false, false, true, false, false], click: 4 },
//         { label: 'Dessert', state: [false, false, false, false, true, false], click: 5 },
//         { label: 'Noodles', state: [false, false, false, false, false, true], click: 6 },
//       ].map((item, idx) => (
//         <button
//           key={idx}
//           onClick={() => {
//             setNashta(item.state[0]);
//             setOota(item.state[1]);
//             setNightOota(item.state[2]);
//             setDrinks(item.state[3]);
//             setIcecream(item.state[4]);
//             setNoodle(item.state[5]);
//             handleClick(item.click);
//             setShowMobileMenu(false);
//           }}
//           className="px-4 py-2 text-left hover:bg-gray-800 rounded transition"
//         >
//           {item.label}
//         </button>
//       ))}
//     </div>
//   )}
// </div>

//  <div className='flex flex-wrap justify-center gap-6 sm:gap-10 mt-10'>
//   {(!menuList || menuList.length === 0) ? (
//   <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 gap-8">
//      <div className='text-2xl sm:text-3xl font-medium bg-red-500 h-16 w-16 sm:h-[90px] sm:w-[90px] rounded-full flex justify-center items-center text-white transform -rotate-12'>
//         Cafe
//       </div>
//     <h1 className="text-4xl font-extrabold text-gray-700">
//       Welcome to BMSCE<span className="text-red-600">.</span>
//     </h1>
//     <p className="text-lg text-gray-600">
//       We are getting your Favorite Dishes...
//     </p>
// <div className="flex space-x-2">
//   <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//   <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//   <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
// </div>
//   </div>
// )
//    : (
//     // Menu Items - Use filteredMenuList instead of menuList
//     filteredMenuList.map((Item, index) => (
//       <div key={index} className='bg-white rounded-3xl p-4 max-w-xs w-full shadow-md flex flex-col items-center'>
//         <img className='w-full h-48 object-cover rounded-xl' src={Item.imgUrl} alt={Item.Name} />
//         <h1 className='text-xl sm:text-2xl font-semibold mt-4'>{Item.Name}</h1>
//         <p className='text-sm text-center mt-2 px-2'>{Item.Description}</p>
//         <div className='flex gap-1 mt-2'>
//           {[...Array(5)].map((_, i) => (
//             <svg key={i} className='w-4 h-4 text-yellow-400' xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
//               <path d="M3.612 15.443c-.396.198-.824-.149-.746-.592l.83-4.73-3.523-3.356c-.329-.314-.158-.888.283-.95l4.898-.696L8.465.792c.197-.39.73-.39.927 0l2.19 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.35.79-.746.592L8 13.187l-4.389 2.256z"/>
//             </svg>
//           ))}
//         </div>
//         <div className='flex items-center justify-between w-full mt-4'>
//           <span className='text-xl font-medium'>Rs. {Item.Price}</span>
//           {Item.qty === 0 ? (
//             <button
//               onClick={() => AddItem(Item)}
//               className='bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition-shadow duration-300 shadow-md'
//             >
//               Order Now
//             </button>
//           ) : (
//             <div className='flex items-center gap-3 bg-red-100 px-3 py-1 rounded-xl shadow-lg'>
//               <button 
//                 onClick={(e) => { e.stopPropagation(); IncrementQty(Item); }} 
//                 className='text-green-600 text-2xl font-bold hover:text-green-800 transition-colors duration-300 select-none'
//                 aria-label="Increase quantity"
//               >
//                 +
//               </button>
//               <span className='font-semibold text-lg'>{Item.qty}</span>
//               <button 
//                 onClick={(e) => { e.stopPropagation(); DecrementQty(Item); }} 
//                 className='text-green-600 text-2xl font-bold hover:text-green-800 transition-colors duration-300 select-none'
//                 aria-label="Decrease quantity"
//               >
//                 -
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     ))
//   )}
// </div>

//   <div className='mt-32'></div>

//   <Toaster/>
// </div>

//   );



// }

// export default Menu;
