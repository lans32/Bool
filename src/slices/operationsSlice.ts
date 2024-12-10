//operationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../api/API';
import { OperationsMocks } from '../modules/mocks';
import { T_Operation } from '../modules/types';
import { setDraftAsk } from "./askSlice";

interface OperationsState {
    name: string;
    operations: T_Operation[];
    loading: boolean;
    error: string | null;
}

const initialState: OperationsState = {
    name: '',
    operations: [],
    loading: false,
    error: null,
};

export const fetchOperations = createAsyncThunk<
    T_Operation[],
    void,
    { state: { operations: OperationsState }; rejectValue: string }
>('operations/fetchOperations', async (_, { getState, dispatch, rejectWithValue }) => {
    const { name } = getState().operations;

    try {
        const response = await API.getOperations();
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data.operations)) throw new Error('Invalid API data');

        const { draft_ask_id, count } = data;

        if (draft_ask_id !== undefined && count !== undefined) {
            dispatch(setDraftAsk({ draftAskId: draft_ask_id, count }));
        }

        return data.operations.filter((operation: T_Operation) =>
            operation.name.toLowerCase().includes(name.toLowerCase())
        );
    } catch (error) {
        console.error('Error fetching operations:', error);

        return OperationsMocks.filter((operation) =>
            operation.name.toLowerCase().includes(name.toLowerCase())
        );
    }
});


const operationsSlice = createSlice({
    name: 'operations',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        resetFilters: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOperations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOperations.fulfilled, (state, action) => {
                state.loading = false;
                state.operations = action.payload;
            })
            .addCase(fetchOperations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch operations';
                state.operations = [];
            });
    },
});

export const { setName, resetFilters } = operationsSlice.actions;
export default operationsSlice.reducer;
