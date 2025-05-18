import { configureStore } from '@reduxjs/toolkit';  // Import from Redux Toolkit
import rootReducer from './reducers/index';  // Import the combined reducer

// Create the Redux store using configureStore
const store = configureStore({
  reducer: rootReducer,  // Pass the combined reducer
});

export default store;
