

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoginStatus,
  setSignUpStatus,
  setCartStatus,
  setMenuList,
  setCounter,
  setUserCart
} from '../redux/actions/index';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const dispatch = useDispatch();

  const { userCart, menuList, counter } = useSelector(state => ({
    userCart: state.userCart,
    menuList: state.menuList,
    counter: state.counter
  }));

  let totalAmt = userCart.reduce((sum, item) => sum + item.qty * item.Price, 0);

  const navigate = useNavigate();
  const back = () => {
    navigate('/home')
  };

  const emptyCart = () => {
    const emptyList = menuList.map(item => ({ ...item, qty: 0 }));
    dispatch(setUserCart([]));
    dispatch(setMenuList(emptyList));
    dispatch(setCounter(0));
  };

  const incrementCartItemQty = (item) => {
    const updatedCart = userCart.map(cartItem =>
      cartItem.Name === item.Name ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
    );
    const updatedMenu = menuList.map(menuItem =>
      menuItem.Name === item.Name ? { ...menuItem, qty: menuItem.qty + 1 } : menuItem
    );
    dispatch(setUserCart(updatedCart));
    dispatch(setMenuList(updatedMenu));
  };

  const decrementCartItemQty = (item) => {
    if (item.qty === 1) {
      dispatch(setUserCart(userCart.filter(cartItem => cartItem.Name !== item.Name)));
      dispatch(setCounter(counter - 1));
    } else {
      const updatedCart = userCart.map(cartItem =>
        cartItem.Name === item.Name ? { ...cartItem, qty: cartItem.qty - 1 } : cartItem
      );
      dispatch(setUserCart(updatedCart));
    }
    const updatedMenu = menuList.map(menuItem =>
      menuItem.Name === item.Name
        ? { ...menuItem, qty: Math.max(menuItem.qty - 1, 0) }
        : menuItem
    );
    dispatch(setMenuList(updatedMenu));
  };

  const confirmOrder = () => {
    navigate('/OrderDetails');
   
  };

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">🛒 Cart Details</h1>

      <div className="flex flex-wrap justify-center  gap-4 mb-6">
        <button onClick={back} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition">
          Back
        </button>
        <button onClick={emptyCart} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition">
          Empty Cart
        </button>
        {totalAmt > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">Total: ₹{totalAmt}</span>
            <div  onClick={confirmOrder} className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition">
              Confirm Order
            </div>
          </div>
        )}
      </div>

      {userCart.length > 0 ? (
       <div className="overflow-x-auto">
  {/* Header */}
  <div className="hidden sm:grid grid-cols-6 gap-4 bg-gray-100 p-4 rounded-lg font-semibold text-center text-gray-700">
    <span>Name</span>
    <span>Image</span>
    <span>Description</span>
    <span>Price</span>
    <span>Qty</span>
    <span>Amount</span>
  </div>

  {/* Cart Items */}
  {userCart.map(
    (item, idx) =>
      item.qty > 0 && (
        <div
          key={idx}
          className="flex flex-col sm:grid sm:grid-cols-6 gap-4 items-center bg-white border my-4 rounded-lg shadow-sm p-4 text-center transition hover:shadow-md"
        >
          <span className="font-medium">{item.Name}</span>

          <img
            src={item.imgUrl}
            alt={item.Name}
            className="h-16 w-16 mx-auto object-cover rounded-lg shadow-sm"
          />

          <span className="text-sm text-gray-700">{item.Description}</span>

          <span className="text-base font-semibold text-gray-800">
            ₹{item.Price}
          </span>

          {/* Quantity Control */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => incrementCartItemQty(item)}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-300 text-green-500 rounded-md text-lg sm:text-xl font-bold shadow hover:bg-gray-100 active:scale-95 transition duration-150"
            >
              +
            </button>

            <span className="text-base sm:text-lg font-semibold text-gray-800">
              {item.qty}
            </span>

            <button
              onClick={() => decrementCartItemQty(item)}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-300 text-red-500 rounded-md text-lg sm:text-xl font-bold shadow hover:bg-gray-100 active:scale-95 transition duration-150"
            >
              −
            </button>
          </div>

          <span className="text-base font-semibold text-gray-800">
            ₹{item.qty * item.Price}
          </span>
        </div>
      )
  )}
</div>

      ) : (
        <div className="text-center text-gray-600 mt-10 text-lg">Your cart is empty.</div>
      )}
    </div>
  );
}

export default Cart;
