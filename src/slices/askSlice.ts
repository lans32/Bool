//askSlice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AskState {
  draftAskId: number | null;
  count: number;
}
const initialState: AskState = {
  draftAskId: null, 
  count: 0,
};
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
});
export const { setDraftAsk, addOperationToAsk, resetAsk, setTotalOperationCount } = askSlice.actions;
export default askSlice.reducer;