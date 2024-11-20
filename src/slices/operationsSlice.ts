// slices/operationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { T_Operation } from '../modules/types';

interface OperationsState {
    operations: T_Operation[];
    isMock: boolean;
    name: string;
    quantity: number;
}

const initialState: OperationsState = {
    operations: [],
    isMock: false,
    name: '',
    quantity: 0,
};

const operationsSlice = createSlice({
    name: 'operations',
    initialState,
    reducers: {
        setOperations: (state, action: PayloadAction<T_Operation[]>) => {
            state.operations = action.payload;
        },
        setIsMock: (state, action: PayloadAction<boolean>) => {
            state.isMock = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setQuantity: (state, action: PayloadAction<number>) => {
            state.quantity = action.payload;
        },
    },
});

export const { setOperations, setIsMock, setName, setQuantity } = operationsSlice.actions;

export default operationsSlice.reducer;
