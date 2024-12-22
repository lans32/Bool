//operationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '../api/API';
import { T_Operation } from '../modules/types';
import { setDraftAsk } from "./askSlice";
import { RootState } from '../store'; // Импортируйте RootState

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

// Fetch operations thunk
export const fetchOperations = createAsyncThunk<
    T_Operation[],
    void,
    { state: RootState; rejectValue: string } // Убедитесь, что здесь используется RootState
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
        return rejectWithValue('Failed to fetch operations');
    }
});

// Fetch operation details thunk
export const fetchOperationDetails = createAsyncThunk<
    T_Operation,
    string,
    { rejectValue: string }
>('operations/fetchOperationDetails', async (id, { rejectWithValue }) => {
    try {
        const response = await API.getOperationDetails(id);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error('Error fetching operation details:', error);
        return rejectWithValue('Failed to fetch operation details');
    }
});

// thunk for adding operation to draft
export const addOperationToDraft = createAsyncThunk<
    void,
    number,
    { rejectValue: string }
>('operations/addOperationToDraft', async (operationId, { dispatch, rejectWithValue }) => {
    try {
        const response = await API.addOperationToDraft(operationId);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        // Dispatch fetchOperations to update the state after adding to draft
        dispatch(fetchOperations());
    } catch (error) {
        console.error('Error adding operation to draft:', error);
        return rejectWithValue('Failed to add operation to draft');
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
            })
            .addCase(fetchOperationDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOperationDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.operations = [action.payload];
            })
            .addCase(fetchOperationDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch operation details';
            })
            .addCase(addOperationToDraft.rejected, (state, action) => {
                state.error = action.payload || 'Failed to add operation to draft';
            });
    },
});

export const { setName, resetFilters } = operationsSlice.actions;
export default operationsSlice.reducer;
