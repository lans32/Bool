// slices/operationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OperationsState {
    name: string;
}

const initialState: OperationsState = {
    name: '',
};

const operationsSlice = createSlice({
    name: 'operations',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        resetFilters(state) {
            Object.assign(state, initialState); // Сбросить состояние к начальному
        },
    },
});

export const { 
    setName,
    resetFilters,
} = operationsSlice.actions;

export default operationsSlice.reducer;
