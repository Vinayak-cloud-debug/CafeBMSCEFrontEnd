



import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    setMenuList, 
    setBreakFast, 
    setLunch, 
    setDinner, 
    setDessert, 
    setDrink, 
    setUserCart, 
    setCounter, 
    setCartStatus,
    setLoginStatus,
    setSignUpStatus,
    setNoodles
    
} from '../redux/actions/index';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from '../pages/Login/login';
import { set } from 'lodash';
import { useAuthContext } from '../context/AuthContext';
import Logout from '../pages/LogOut/Logout';
import toast, { Toaster } from 'react-hot-toast';

function Menu() {
  const dispatch = useDispatch();

  const {authUser} = useAuthContext();
  console.log(authUser)

  const {
    breakFast,
    lunch,
    dinner,
    dessert,
    drink,
    userCart,
    menuList,
    counter,
    noodles
    
  } = useSelector(state => state);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenuList, setFilteredMenuList] = useState([]);

  // Reset all category flags to 0
  const resetCategories = () => {
    dispatch(setBreakFast(0));
    dispatch(setLunch(0));
    dispatch(setDinner(0));
    dispatch(setDrink(0));
    dispatch(setDessert(0));
    dispatch(setNoodles(0));
  };

  // Filter menu items based on search query using regex
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMenuList(menuList);
      return;
    }

    try {
      const regex = new RegExp(searchQuery.trim(), 'i'); // Case insensitive search
      const filtered = menuList.filter(item => 
        regex.test(item.Name) || 
        regex.test(item.Description) ||
        regex.test(item.Category)
      );
      setFilteredMenuList(filtered);
    } catch (error) {
      // If regex is invalid, fall back to simple string matching
      const filtered = menuList.filter(item => 
        item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMenuList(filtered);
    }
  }, [searchQuery, menuList]);

  useEffect(() => {
  axios.get("https://cafebmscebackend.onrender.com/api/GetAllFoodItems")
    .then(response => {

      setTimeout(()=>{

        const updatedMenuList = response.data.map(Item => {
        const CartItem = userCart.find(cartItem => cartItem.Name === Item.Name);
        return CartItem ? { ...Item, qty: CartItem.qty } : { ...Item, qty: 0 };
      });
      dispatch(setMenuList(updatedMenuList));
      },1500)
      
    })
    .catch(err => console.log(err));
}, []); // <--- add userCart as a dependency

  const [nashta,setNashta] = useState(false);
  const [oota,setOota] = useState(false);
  const [nightOota,setNightOota] = useState(false);
  const [drinks,setDrinks] = useState(false);
  const [icecream,setIcecream] = useState(false);
  const [noodle,setNoodle] = useState(false)

  const handleClick = (index) => {

    switch (index) {
      case 1:
        
        dispatch(setBreakFast(1));
        break;
      case 2:
        dispatch(setLunch(2));
        break;
      case 3:
        dispatch(setDinner(3));
        break;
      case 4:
        dispatch(setDrink(4));
        break;
      case 5:
        dispatch(setDessert(5));
        break;
      case 6:
        dispatch(setNoodles(6));
      default:
        break;
    }

    const categories = ["Breakfast", "lunch", "Dinner", "Drink", "Dessert","Noodles"];
    const selectedCategory = categories[index - 1];

    if (selectedCategory) {
      
     dispatch(setMenuList([]));

      axios.post("https://cafebmscebackend.onrender.com/api/GetFoodItemsByCategory", { SelectedCategory: selectedCategory })
        .then(response => {

          setTimeout(()=>{

            const updatedMenuList = response.data.map(Item => {
            const CartItem = userCart.find(cartItem => cartItem.Name === Item.Name);
            return CartItem ? { ...Item, qty: CartItem.qty } : { ...Item, qty: 0 };
          });
          
          dispatch(setMenuList(updatedMenuList));
          },1500)
          
        })
        .catch(err => console.log(err));
    }
  };

  const AddItem = (Food) => {

    if(authUser == null){
      toast.error('Login to Order your Dishes')
      return;
    }

  if (!breakFast && !lunch && !dinner && !dessert && !drinks && !noodle) {
    alert("Select the Food Category");
    return;
  }

  const existingCartItem = userCart.find(item => item.Name === Food.Name);

  if (existingCartItem) {
    IncrementQty(Food);
  } else {
    const updatedFood = { ...Food, qty: 1 };
    const updatedMenuList = menuList.map(item => 
      item.Name === Food.Name ? updatedFood : item
    );
    
    dispatch(setMenuList(updatedMenuList));
    dispatch(setUserCart([...userCart, updatedFood]));
    dispatch(setCounter(counter + 1));
  }
};

const IncrementQty = (Food) => {
  if (!breakFast && !lunch && !dinner && !dessert && !drink && !noodle) {
    alert("Select the Food Category");
    return;
  }

  const updatedMenuList = menuList.map(item =>
    item.Name === Food.Name ? { ...item, qty: item.qty + 1 } : item
  );
  dispatch(setMenuList(updatedMenuList));

  const existingCartItem = userCart.find(item => item.Name === Food.Name);
  if (existingCartItem) {
    const updatedCart = userCart.map(item =>
      item.Name === Food.Name ? { ...item, qty: item.qty + 1 } : item
    );
    dispatch(setUserCart(updatedCart));
  } else {
    dispatch(setUserCart([...userCart, { ...Food, qty: 1 }]));
    dispatch(setCounter(counter + 1));
  }
};

const DecrementQty = (Food) => {
  if (!breakFast && !lunch && !dinner && !dessert && !drink && !noodle) {
    alert("Select the Food Category");
    return;
  }

  if (Food.qty > 0) {
    const updatedMenuList = menuList.map(item =>
      item.Name === Food.Name ? { ...item, qty: item.qty - 1 } : item
    );
    dispatch(setMenuList(updatedMenuList));

    if (Food.qty === 1) {
      const updatedCart = userCart.filter(item => item.Name !== Food.Name);
      dispatch(setUserCart(updatedCart));
      dispatch(setCounter(counter - 1));
    } else {
      const updatedCart = userCart.map(item =>
        item.Name === Food.Name ? { ...item, qty: item.qty - 1 } : item
      );
      dispatch(setUserCart(updatedCart));
    }
  }
};

  // Fix whitespace in returned class names, add responsive text size
  const getCategoryStyle = (isActive) => 
    `block px-4 py-2 text-xl sm:text-2xl cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
      isActive ? 'bg-red-500 text-white' : 'bg-transparent hover:bg-red-100'
    }`;

  const Checkout = () => {
    navigate("/cart");
  };

  const navigate = useNavigate();

  const About = () => {
    navigate("/About");
  }
  const OrderOnline = () => {
    navigate("/OrderOnline");
  }
  const Reservation = () => {
    navigate("/Reservation");
  }
  const ContactUs = () => {
    navigate("/ContactUs");
  }

  const cname = sessionStorage.getItem('canteen')
  const [canteenName,setCanteenName] = useState(cname)
  const [login,setLogin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className='bg-orange-50 min-h-screen flex flex-col gap-12 px-4 sm:px-8 relative'>

    {authUser === null && !login? 
      <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      // clicking outside closes modal
    >

      <div 
        className="relative z-60  rounded-lg p-6 w-full max-w-md"
        
      >
        {/* Close button */}
        <button
          onClick={() => setLogin(!login)}
          className="absolute top-64 right-16 lg:top-44 lg:right-16 text-red-700 hover:text-gray-900 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <Login />
      </div>
    </div>
    :null}

  <div className='flex flex-wrap items-center justify-between py-6'>
    <div className='flex flex-row items-center gap-8'>
      <div className='text-2xl sm:text-3xl font-medium bg-red-500 h-16 w-16 sm:h-[90px] sm:w-[90px] rounded-full flex justify-center items-center text-white transform -rotate-12'>
        Cafe
      </div>
      <h1 className='text-2xl sm:text-3xl font-bold'>BMSCE<span className='text-red-600'>.</span></h1>
      <div className='flex flex-wrap gap-6 text-sm sm:text-lg mt-4 sm:mt-0'>
      <span onClick={About} className='cursor-pointer text-base lg:text-lg -mt-3 lg:-mt-0 font-semibold hover:text-orange-500'>About us</span>
      <span onClick={ContactUs} className='cursor-pointer text-base lg:text-lg -mt-3 lg:-mt-0 font-semibold hover:text-orange-500'>Contact Us</span>
    </div>
    </div>

    <div className='flex items-center gap-4 mt-4 sm:mt-0'>

      {authUser === null ? 
      <div 
        onClick={() => setLogin(!login)} 
        className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-3xl cursor-pointer shadow-lg hover:from-red-600 hover:to-red-700 transition duration-300 ease-in-out flex items-center justify-center select-none"
      >
        <h1 className="text-sm sm:text-base font-semibold tracking-wide drop-shadow-sm">
          Log in
        </h1>
      </div>

:
  <div className='flex flex-wrap gap-5'>
 <div onClick={Checkout} className='text-xl sm:text-2xl bg-white h-10 w-10 sm:h-[60px] sm:w-[60px] rounded-full flex justify-center items-center cursor-pointer'>
        <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 16 16"
  className="w-6 h-6"
>
  <path d="M0 1a1 1 0 0 1 1-1h1.5a.5.5 0 0 1 .485.379L3.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.402L1.61 1.607 1.11 0H1a1 1 0 0 1-1-1zm3.14 3l1.25 6h8.197l1.2-5.6H4.89L3.14 3zM5.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
</svg>

    </div>

<div 
  onClick={()=>navigate('/MyProfile')}
  className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-3xl cursor-pointer shadow-lg hover:from-red-600 hover:to-red-700 transition duration-300 ease-in-out flex items-center justify-center select-none"
>
  <h1 className="text-sm sm:text-base font-semibold tracking-wide drop-shadow-sm">
    My Profile
  </h1>
</div>

<Logout/>
    </div>
}

    </div>
  </div>

  {/* Title */}
  <h1 className='text-3xl sm:text-5xl font-bold text-center'>Welcome to {canteenName}'s Menu</h1>

  {/* Search Bar */}
  <div className='flex justify-center'>
    <div className='relative w-full max-w-md'>
      <input
        type="text"
        placeholder="Search for dishes, ingredients, or categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='w-full px-4 py-3 pr-12 text-lg border-2 border-red-200 rounded-full focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 shadow-sm'
      />
      <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-red-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </div>
  </div>


 {(!nashta && !oota && !nightOota && !icecream && !noodle && !drinks)?

    <h2 className='font-medium text-lg'>Select Your Dish Category from Menu Icon </h2>
  :
  (nashta && !oota && !nightOota && !icecream && !noodle && !drinks)?
  <h2 className='font-medium text-lg'>Here are you Breakfast Dishes </h2>
  :

    (!nashta && oota && !nightOota && !icecream && !noodle && !drinks)?
    <h2 className='font-medium text-lg'>Here are you Lunch </h2>
  :

      (!nashta && !oota && nightOota && !icecream && !noodle && !drinks)?
      <h2 className='font-medium text-lg'>Here are your Dinner </h2>
  :

        (!nashta && !oota && !nightOota && icecream && !noodle && !drinks)?
        <h2 className='font-medium text-lg'>Here are your Delicious Icecreams </h2>
  :

          (!nashta && !oota && !nightOota && !icecream && noodle && !drinks)?
          <h2 className='font-medium text-lg'>Here are you Noodles </h2>
  :

            (!nashta && !oota && !nightOota && !icecream && !noodle && drinks)?
            <h2 className='font-medium text-lg'>Here are your Drinks </h2>
  :null

            
  }

  {/* Search Results Info */}
  {searchQuery && (
    <div className='text-center text-gray-600'>
      {filteredMenuList.length > 0 
        ? `Found ${filteredMenuList.length} item${filteredMenuList.length !== 1 ? 's' : ''} for "${searchQuery}"`
        : `No items found for "${searchQuery}"`
      }
    </div>
  )}

  <div className="fixed bottom-20 right-6 z-50">
  {/* Floating Toggle Button */}
  <button
    onClick={() => setShowMobileMenu(prev => !prev)}
    className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 active:scale-95 transition duration-200"
    aria-label="Open category menu"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
</svg>
  </button>

  {/* Dropdown Menu */}
  {showMobileMenu && (
    <div className="absolute bottom-16 right-0 bg-black text-white rounded-lg shadow-2xl p-2 w-40 flex flex-col space-y-1 animate-fade-in">
      {[
        { label: 'Breakfast', state: [true, false, false, false, false, false], click: 1 },
        { label: 'Lunch', state: [false, true, false, false, false, false], click: 2 },
        { label: 'Dinner', state: [false, false, true, false, false, false], click: 3 },
        { label: 'Drinks', state: [false, false, false, true, false, false], click: 4 },
        { label: 'Dessert', state: [false, false, false, false, true, false], click: 5 },
        { label: 'Noodles', state: [false, false, false, false, false, true], click: 6 },
      ].map((item, idx) => (
        <button
          key={idx}
          onClick={() => {
            setNashta(item.state[0]);
            setOota(item.state[1]);
            setNightOota(item.state[2]);
            setDrinks(item.state[3]);
            setIcecream(item.state[4]);
            setNoodle(item.state[5]);
            handleClick(item.click);
            setShowMobileMenu(false);
          }}
          className="px-4 py-2 text-left hover:bg-gray-800 rounded transition"
        >
          {item.label}
        </button>
      ))}
    </div>
  )}
</div>

 <div className='flex flex-wrap justify-center gap-6 sm:gap-10 mt-10'>
  {(!menuList || menuList.length === 0) ? (
  <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 gap-8">
     <div className='text-2xl sm:text-3xl font-medium bg-red-500 h-16 w-16 sm:h-[90px] sm:w-[90px] rounded-full flex justify-center items-center text-white transform -rotate-12'>
        Cafe
      </div>
    <h1 className="text-4xl font-extrabold text-gray-700">
      Welcome to BMSCE<span className="text-red-600">.</span>
    </h1>
    <p className="text-lg text-gray-600">
      We are getting your Favorite Dishes...
    </p>
<div className="flex space-x-2">
  <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
  <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
  <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
</div>
  </div>
)
   : (
    // Menu Items - Use filteredMenuList instead of menuList
    filteredMenuList.map((Item, index) => (
      <div key={index} className='bg-white rounded-3xl p-4 max-w-xs w-full shadow-md flex flex-col items-center'>
        <img className='w-full h-48 object-cover rounded-xl' src={Item.imgUrl} alt={Item.Name} />
        <h1 className='text-xl sm:text-2xl font-semibold mt-4'>{Item.Name}</h1>
        <p className='text-sm text-center mt-2 px-2'>{Item.Description}</p>
        <div className='flex gap-1 mt-2'>
          {[...Array(5)].map((_, i) => (
            <svg key={i} className='w-4 h-4 text-yellow-400' xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.396.198-.824-.149-.746-.592l.83-4.73-3.523-3.356c-.329-.314-.158-.888.283-.95l4.898-.696L8.465.792c.197-.39.73-.39.927 0l2.19 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.35.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          ))}
        </div>
        <div className='flex items-center justify-between w-full mt-4'>
          <span className='text-xl font-medium'>Rs. {Item.Price}</span>
          {Item.qty === 0 ? (
            <button
              onClick={() => AddItem(Item)}
              className='bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition-shadow duration-300 shadow-md'
            >
              Order Now
            </button>
          ) : (
            <div className='flex items-center gap-3 bg-red-100 px-3 py-1 rounded-xl shadow-lg'>
              <button 
                onClick={(e) => { e.stopPropagation(); IncrementQty(Item); }} 
                className='text-green-600 text-2xl font-bold hover:text-green-800 transition-colors duration-300 select-none'
                aria-label="Increase quantity"
              >
                +
              </button>
              <span className='font-semibold text-lg'>{Item.qty}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); DecrementQty(Item); }} 
                className='text-green-600 text-2xl font-bold hover:text-green-800 transition-colors duration-300 select-none'
                aria-label="Decrease quantity"
              >
                -
              </button>
            </div>
          )}
        </div>
      </div>
    ))
  )}
</div>

  <div className='mt-32'></div>

  <Toaster/>
</div>

  );
}

export default Menu;
