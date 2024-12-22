// src/slices/askSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/API';

interface AskState {
  draftAskId: number | null;
  count: number;
  asks: Ask[];
  loading: boolean;
  error: string | null;
}

interface Ask {
  id: string;
  first_operand: boolean | null;
  created_at: string;
  formed_at: string;
  completed_at: string;
  status: string;
  creator: string;
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
      });
  },
});

export const { setDraftAsk, addOperationToAsk, resetAsk, setTotalOperationCount } = askSlice.actions;
export default askSlice.reducer;