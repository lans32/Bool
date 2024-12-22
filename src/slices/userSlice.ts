// src/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../api/API";

interface UserState {
    isLoggedIn: boolean;
    userName: string | null;
    isStaff: boolean;
    error: string | null;
}

const initialState: UserState = {
    isLoggedIn: false,
    userName: null,
    isStaff: false,
    error: null,
};

// Thunk for logging in
export const loginUser = createAsyncThunk<
    { username: string; isStaff: boolean }, // Return type
    { email: string; password: string }, // Argument type
    { rejectValue: string } // ThunkAPI type
>(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await API.login({ email, password });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            return { username: data.username, isStaff: data.is_staff };
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка при входе в систему.");
        }
    }
);

// Thunk for updating profile
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ email, password }: { email?: string; password?: string }, { rejectWithValue }) => {
        try {
            await API.updateProfile(email, password);
            return email || ""; // Return an empty string if email is undefined
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка при обновлении профиля.");
        }
    }
);

// Thunk for logging out
export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await API.logout();
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка при выходе из системы.");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ username: string; isStaff: boolean }>) {
            state.isLoggedIn = true;
            state.userName = action.payload.username;
            state.isStaff = action.payload.isStaff;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.userName = action.payload.username;
                state.isStaff = action.payload.isStaff;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.userName = action.payload;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
            state.isLoggedIn = false;
            state.userName = null;
            state.isStaff = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;