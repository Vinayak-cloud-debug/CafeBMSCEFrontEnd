// Define action types
export const SET_MENU_LIST = 'SET_MENU_LIST';
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS';
export const SET_SIGNUP_STATUS = 'SET_SIGNUP_STATUS';
export const SET_CONFIRMED_LOGIN = 'SET_CONFIRMED_LOGIN';
export const SET_CART_STATUS = 'SET_CART_STATUS';
export const SET_USER_CART = 'SET_USER_CART';
export const SET_COUNTER = 'SET_COUNTER';
export const SET_BREAKFAST = 'SET_BREAKFAST';
export const SET_DINNER = 'SET_DINNER';
export const SET_DRINK = 'SET_DRINK';
export const SET_LUNCH = 'SET_LUNCH';
export const SET_DESSERT = 'SET_DESSERT';
export const SET_NOODLES = 'SET_NOODLES';
export const SET_EMPTY_MENU_LIST = 'SET_EMPTY_MENU_LIST';

// Action creators

export const setNoodles = (noodles) => ({
  type: SET_NOODLES,
  payload: noodles,
});

export const setMenuList = (menuList) => ({
  type: SET_MENU_LIST,
  payload: menuList,
});

export const setLoginStatus = (status) => ({
  type: SET_LOGIN_STATUS,
  payload: status,
});

export const setSignUpStatus = (status) => ({
  type: SET_SIGNUP_STATUS,
  payload: status,
});

export const setConfirmedLogin = (status) => ({
  type: SET_CONFIRMED_LOGIN,
  payload: status,
});

export const setCartStatus = (status) => ({
  type: SET_CART_STATUS,
  payload: status,
});

export const setUserCart = (cart) => ({
  type: SET_USER_CART,
  payload: cart,
});

export const setCounter = (count) => ({
  type: SET_COUNTER,
  payload: count,
});

export const setBreakFast = (breakFast) => ({
  type: SET_BREAKFAST,
  payload: breakFast,
});

export const setDrink = (drink) => ({
    type: SET_DRINK,
    payload: drink,
  });

export const setLunch = (lunch) => ({
    type: SET_BREAKFAST,
    payload: lunch,
  });

  export const setDinner = (dinner) => ({
    type: SET_BREAKFAST,
    payload: dinner,
  });

  
  export const setDessert = (dessert) => ({
    type: SET_BREAKFAST,
    payload: dessert,
  });
  

export const setEmptyMenuList = (status) => ({
  type: SET_EMPTY_MENU_LIST,
  payload: status,
});
