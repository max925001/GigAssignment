import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

const initialState = {
    gigs: [],
    myGigs: [],
    currentGig: null,
    loading: false,
    error: null,
};

export const fetchGigs = createAsyncThunk('gigs/fetchAll', async (keyword = '', { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/gigs?keyword=${keyword}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch gigs');
    }
});

export const fetchMyGigs = createAsyncThunk('gigs/fetchMy', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/gigs/my');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch your gigs');
    }
});

export const createGig = createAsyncThunk('gigs/create', async (gigData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/gigs', gigData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Failed to create gig');
    }
});

export const fetchGigById = createAsyncThunk('gigs/fetchById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/gigs/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch gig details');
    }
});

const gigSlice = createSlice({
    name: 'gigs',
    initialState,
    reducers: {
        clearCurrentGig: (state) => {
            state.currentGig = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGigs.pending, (state) => { state.loading = true; })
            .addCase(fetchGigs.fulfilled, (state, action) => {
                state.loading = false;
                state.gigs = action.payload.gigs || action.payload;
            })
            .addCase(fetchGigs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchMyGigs.pending, (state) => { state.loading = true; })
            .addCase(fetchMyGigs.fulfilled, (state, action) => { state.loading = false; state.myGigs = action.payload; })
            .addCase(fetchMyGigs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchGigById.pending, (state) => { state.loading = true; })
            .addCase(fetchGigById.fulfilled, (state, action) => { state.loading = false; state.currentGig = action.payload; })
            .addCase(fetchGigById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createGig.pending, (state) => { state.loading = true; })
            .addCase(createGig.fulfilled, (state, action) => { state.loading = false; })
            .addCase(createGig.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { clearCurrentGig } = gigSlice.actions;
export default gigSlice.reducer;
