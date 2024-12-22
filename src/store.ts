//store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import operationsReducer from './slices/operationsSlice';
import userReducer from './slices/userSlice';
import askReducer from './slices/askSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Конфигурация redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Сохраняем только user
};

// Комбинируем редьюсеры
const rootReducer = combineReducers({
  operations: operationsReducer,
  user: userReducer,
  ask: askReducer,
});

// Оборачиваем rootReducer в persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Создаем store с persistedReducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Отключаем проверки для redux-persist
    }),
});

// Экспортируем persistor для использования в <PersistGate>
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
