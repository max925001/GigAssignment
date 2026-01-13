import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/register', userData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Registration failed');
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await api.post('/auth/logout');
        return null;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Logout failed');
    }
});

export const validateSession = createAsyncThunk('auth/validate', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/profile');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Session invalid');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(validateSession.pending, (state) => { state.loading = true; })
            .addCase(validateSession.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(validateSession.rejected, (state) => { state.loading = false; state.user = null; })

            .addCase(logout.fulfilled, (state) => { state.user = null; });
    },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
