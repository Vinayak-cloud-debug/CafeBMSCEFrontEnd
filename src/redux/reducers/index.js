import { combineReducers } from 'redux';
import {
  SET_MENU_LIST,
  SET_LOGIN_STATUS,
  SET_SIGNUP_STATUS,
  SET_CONFIRMED_LOGIN,
  SET_CART_STATUS,
  SET_USER_CART,
  SET_COUNTER,
  SET_BREAKFAST,
  SET_EMPTY_MENU_LIST,
  SET_LUNCH,
    SET_DINNER,
    SET_DESSERT,
    SET_NOODLES
    
} from '../actions/index';

// Initial state for each value
const initialState = {
  menuList: [],
  loginStatus: false,
  signUpStatus: false,
  confirmedLogin: false,
  cartStatus: false,
  userCart: [],
  counter: 0,
  breakFast: 0,
  emptyMenuList: 0,
  lunch : 0,
    dinner : 0,
    dessert : 0,
    noodles:0
  
};

// Initial state for each value


// Reducers for each state property
const menuListReducer = (state = initialState.menuList, action) => {
  switch (action.type) {
    case SET_MENU_LIST:
      return action.payload;
    default:
      return state;
  }
};

const loginStatusReducer = (state = initialState.loginStatus, action) => {
  switch (action.type) {
    case SET_LOGIN_STATUS:
      return action.payload;
    default:
      return state;
  }
};

const signUpStatusReducer = (state = initialState.signUpStatus, action) => {
  switch (action.type) {
    case SET_SIGNUP_STATUS:
      return action.payload;
    default:
      return state;
  }
};

const confirmedLoginReducer = (state = initialState.confirmedLogin, action) => {
  switch (action.type) {
    case SET_CONFIRMED_LOGIN:
      return action.payload;
    default:
      return state;
  }
};

const cartStatusReducer = (state = initialState.cartStatus, action) => {
  switch (action.type) {
    case SET_CART_STATUS:
      return action.payload;
    default:
      return state;
  }
};

const userCartReducer = (state = initialState.userCart, action) => {
  switch (action.type) {
    case SET_USER_CART:
      return action.payload;
    default:
      return state;
  }
};

const counterReducer = (state = initialState.counter, action) => {
  switch (action.type) {
    case SET_COUNTER:
      return action.payload;
    default:
      return state;
  }
};


const breakFastReducer = (state = initialState.breakFast, action) => {
    switch (action.type) {
      case SET_BREAKFAST:
        return action.payload;
      default:
        return state;
    }
  };
  
  const dinnerReducer = (state = initialState.breakFast, action) => {
      switch (action.type) {
        case SET_DINNER:
          return action.payload;
        default:
          return state;
      }
    };
  
    
    const lunchReducer = (state = initialState.breakFast, action) => {
      switch (action.type) {
        case SET_LUNCH:
          return action.payload;
        default:
          return state;
      }
    };
  
    
    const dessertReducer = (state = initialState.breakFast, action) => {
      switch (action.type) {
        case SET_DESSERT:
          return action.payload;
        default:
          return state;
      }
    };

    
const noodlesReducer = (state = initialState.noodles, action) => {
    switch (action.type) {
      case SET_NOODLES:
        return action.payload;
      default:
        return state;
    }
  };
  
    
  

const emptyMenuListReducer = (state = initialState.emptyMenuList, action) => {
  switch (action.type) {
    case SET_EMPTY_MENU_LIST:
      return action.payload;
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  menuList: menuListReducer,
  loginStatus: loginStatusReducer,
  signUpStatus: signUpStatusReducer,
  confirmedLogin: confirmedLoginReducer,
  cartStatus: cartStatusReducer,
  userCart: userCartReducer,
  counter: counterReducer,
  breakFast: breakFastReducer,
    lunch: lunchReducer,
    dinner: dinnerReducer,
    dessert: dessertReducer,
    noodles:noodlesReducer,
  emptyMenuList: emptyMenuListReducer,
});

export default rootReducer;
