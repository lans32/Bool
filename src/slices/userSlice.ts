// slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    isLoggedIn: boolean;
    userName: string | null;
    isStaff: boolean;
}

const initialState: UserState = {
    isLoggedIn: false,
    userName: null,
    isStaff: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ username: string; isStaff: boolean }>) {
            state.isLoggedIn = true;
            state.userName = action.payload.username;
            state.isStaff = action.payload.isStaff;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.userName = null;
            state.isStaff = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;