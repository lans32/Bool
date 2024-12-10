import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Типизированный dispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Типизированный selector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
