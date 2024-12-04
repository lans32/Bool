// store/index.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import operationsReducer from './slices/operationsSlice';
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
    operations: operationsReducer,
    user: userReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;