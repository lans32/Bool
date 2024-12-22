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

// Thunk for creating a new operation
export const createOperation = createAsyncThunk<
    void,
    Omit<T_Operation, 'id'>,
    { rejectValue: string }
>('operations/createOperation', async (operationData, { dispatch, rejectWithValue }) => {
    try {
        const response = await API.createOperation(operationData);
        if (!response.ok) throw new Error('Failed to create operation');
        dispatch(fetchOperations()); // Refresh operations list
    } catch (error) {
        console.error('Error creating operation:', error);
        return rejectWithValue('Failed to create operation');
    }
});

// Thunk for updating an operation
export const updateOperation = createAsyncThunk<
    void,
    T_Operation,
    { rejectValue: string }
>('operations/updateOperation', async (operation, { rejectWithValue }) => {
    try {
        const response = await API.updateOperation(operation.id, operation);
        if (!response.ok) throw new Error('Failed to update operation');
    } catch (error) {
        console.error('Error updating operation:', error);
        return rejectWithValue('Failed to update operation');
    }
});

// Thunk for deleting an operation
export const deleteOperation = createAsyncThunk<
    void,
    number,
    { rejectValue: string }
>('operations/deleteOperation', async (id, { dispatch, rejectWithValue }) => {
    try {
        const response = await API.deleteOperation(id);
        if (!response.ok) throw new Error('Failed to delete operation');
        dispatch(fetchOperations()); // Refresh operations list
    } catch (error) {
        console.error('Error deleting operation:', error);
        return rejectWithValue('Failed to delete operation');
    }
});

// Add this thunk for updating the operation image
export const updateOperationImage = createAsyncThunk<
    string, // Return type
    { id: string; formData: FormData }, // Argument type
    { rejectValue: string }
>('operations/updateOperationImage', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await API.operationsImageUpdate(id, formData);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.photo ? errorData.photo.join(', ') : 'Failed to update image');
        }
        const data = await response.json();
        return data.photo_url.split('/').pop(); // Return the image name
    } catch (error) {
        console.error('Error updating operation image:', error);
        return rejectWithValue('Failed to update image');
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
            })
            .addCase(createOperation.rejected, (state, action) => {
                state.error = action.payload || 'Failed to create operation';
            })
            .addCase(updateOperation.rejected, (state, action) => {
                state.error = action.payload || 'Failed to update operation';
            })
            .addCase(deleteOperation.rejected, (state, action) => {
                state.error = action.payload || 'Failed to delete operation';
            })
            .addCase(updateOperationImage.rejected, (state, action) => {
                state.error = action.payload || 'Failed to update image';
            });
    },
});

export const { setName, resetFilters } = operationsSlice.actions;
export default operationsSlice.reducer;
