import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/API';

interface Operation {
    id: number;
    name: string;
    operator_name: string;
    description: string;
    photo: string;
    status: string;
    value_0: boolean;
    value_A: boolean;
    value_B: boolean;
    value_AB: boolean;
}

interface Ask {
    id: string;
    first_operand: boolean | null;
    created_at: string;
    formed_at: string;
    completed_at: string;
    status: string;
    creator: string;
    operations: { operation: Operation; second_operand: boolean | null; result: boolean | null; }[];
}

interface AskState {
    draftAskId: number | null;
    count: number;
    asks: Ask[];
    loading: boolean;
    error: string | null;
}

const initialState: AskState = {
    draftAskId: null,
    count: 0,
    asks: [],
    loading: false,
    error: null,
};

// Thunks
export const fetchAsks = createAsyncThunk('ask/fetchAsks', async (status: string, { rejectWithValue }) => {
    try {
        const response = await API.getAsks({ status });
        const data = await response.json();
        return data as Ask[];
    } catch (error) {
        return rejectWithValue('Ошибка при загрузке заявок');
    }
});

// Thunks
export const fetchAskById = createAsyncThunk('ask/fetchAskById', async (id: number, { rejectWithValue }) => {
    try {
        const response = await API.getAskById(id);
        if (!response.ok) throw new Error('Не удалось загрузить заявку');
        return await response.json();
    } catch (error) {
        return rejectWithValue(`Ошибка загрузки заявки с ID ${id}`);
    }
});

export const formAsk = createAsyncThunk('ask/formAsk', async (id: number, { rejectWithValue }) => {
    try {
        const response = await API.formAsk(id);
        if (!response.ok) throw new Error('Не удалось вычислить заявку');
        return id;
    } catch (error) {
        return rejectWithValue(`Ошибка вычисления заявки с ID ${id}`);
    }
});

export const deleteAsk = createAsyncThunk('ask/deleteAsk', async (id: number, { rejectWithValue }) => {
    try {
        const response = await API.deleteAsk(id);
        if (!response.ok) throw new Error('Не удалось удалить заявку');
        return id;
    } catch (error) {
        return rejectWithValue(`Ошибка удаления заявки с ID ${id}`);
    }
});

export const deleteOperationFromDraft = createAsyncThunk(
    'ask/deleteOperationFromDraft',
    async ({ id, operationId }: { id: number; operationId: number }, { rejectWithValue }) => {
        try {
            const response = await API.deleteOperationFromDraft(id, operationId);
            if (!response.ok) throw new Error('Не удалось удалить операцию');
            return operationId;
        } catch (error) {
            return rejectWithValue(`Ошибка удаления операции с ID ${operationId}`);
        }
    }
);

export const changeFirstOperand = createAsyncThunk(
    'ask/changeFirstOperand',
    async ({ id, newFirstOperand }: { id: number; newFirstOperand: boolean }, { rejectWithValue }) => {
        try {
            const response = await API.changeAddFields(id, newFirstOperand);
            if (!response.ok) throw new Error('Не удалось изменить первый операнд');
            return newFirstOperand;
        } catch (error) {
            return rejectWithValue(`Ошибка изменения первого операнда для заявки с ID ${id}`);
        }
    }
);

export const changeOperationFields = createAsyncThunk(
    'ask/changeOperationFields',
    async (
        { operationId, askId, newSecondOperand }: { operationId: number; askId: number; newSecondOperand: boolean },
        { rejectWithValue }
    ) => {
        try {
            const response = await API.changeOperationFields(operationId, askId, newSecondOperand);
            if (!response.ok) throw new Error('Не удалось изменить второй операнд');
            return { operationId, newSecondOperand };
        } catch (error) {
            return rejectWithValue(`Ошибка изменения второго операнда для операции с ID ${operationId}`);
        }
    }
);

export const completeAsk = createAsyncThunk('ask/completeAsk', async (id: number, { rejectWithValue }) => {
    try {
        const response = await API.completeAsk(id);
        if (!response.ok) {
            throw new Error('Не удалось завершить заявку');
        }
        return id;
    } catch (error) {
        return rejectWithValue(`Ошибка при завершении заявки с ID ${id}`);
    }
});

export const rejectAsk = createAsyncThunk('ask/rejectAsk', async (id: number, { rejectWithValue }) => {
    try {
        const response = await API.rejectedAsk(id);
        if (!response.ok) {
            throw new Error('Не удалось отклонить заявку');
        }
        return id;
    } catch (error) {
        return rejectWithValue(`Ошибка при отклонении заявки с ID ${id}`);
    }
});

const askSlice = createSlice({
    name: 'ask',
    initialState,
    reducers: {
        setDraftAsk: (state, action: PayloadAction<{ draftAskId: number, count: number }>) => {
            state.draftAskId = action.payload.draftAskId;
            state.count = action.payload.count;
        },
        setTotalOperationCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
        addOperationToAsk: (state) => {
            if (state.draftAskId !== null) {
                state.count += 1;
            }
        },
        resetAsk: (state) => {
            state.draftAskId = null;
            state.count = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAsks.fulfilled, (state, action) => {
                state.loading = false;
                state.asks = action.payload;
            })
            .addCase(fetchAsks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(completeAsk.fulfilled, (state, action) => {
                state.asks = state.asks.filter(ask => ask.id !== action.payload.toString());
            })
            .addCase(rejectAsk.fulfilled, (state, action) => {
                state.asks = state.asks.filter(ask => ask.id !== action.payload.toString());
            })
            .addCase(fetchAskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAskById.fulfilled, (state, action) => {
                state.loading = false;
                state.asks = [action.payload];
            })
            .addCase(fetchAskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(formAsk.fulfilled, (state, action) => {
                state.asks = state.asks.filter(ask => ask.id !== action.payload.toString());
            })
            .addCase(deleteAsk.fulfilled, (state, action) => {
                state.asks = state.asks.filter(ask => ask.id !== action.payload.toString());
            })
            .addCase(deleteOperationFromDraft.fulfilled, (state, action) => {
                const ask = state.asks.find(ask => ask.id === state.draftAskId?.toString());
                if (ask) {
                    ask.operations = ask.operations.filter(op => op.operation.id !== action.payload);
                }
            })
            .addCase(changeFirstOperand.fulfilled, (state, action) => {
                const ask = state.asks.find(ask => ask.id === state.draftAskId?.toString());
                if (ask) {
                    ask.first_operand = action.payload;
                }
            })
            .addCase(changeOperationFields.fulfilled, (state, action) => {
                const ask = state.asks.find(ask => ask.id === state.draftAskId?.toString());
                if (ask) {
                    const operation = ask.operations.find(op => op.operation.id === action.payload.operationId);
                    if (operation) {
                        operation.second_operand = action.payload.newSecondOperand;
                    }
                }
            });
    },
});

export const { setDraftAsk, addOperationToAsk, resetAsk, setTotalOperationCount } = askSlice.actions;
export default askSlice.reducer;