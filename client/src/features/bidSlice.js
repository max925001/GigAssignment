import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

const initialState = {
    bids: [],
    myApplications: [],
    loading: false,
    error: null,
    hiringStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

export const fetchBidsByGig = createAsyncThunk('bids/fetchByGig', async (gigId, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/bids/${gigId}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch bids');
    }
});

export const submitBid = createAsyncThunk('bids/submit', async (bidData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/bids', bidData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Failed to submit bid');
    }
});

export const hireFreelancer = createAsyncThunk('bids/hire', async (bidId, { rejectWithValue }) => {
    try {
        const { data } = await api.patch(`/bids/${bidId}/hire`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Hiring failed');
    }
});

export const fetchMyApplications = createAsyncThunk('bids/fetchMy', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/bids/my');
        return data;
    } catch (err) {
        return rejectWithValue(err.response.data.message || 'Failed to fetch applications');
    }
});

const bidSlice = createSlice({
    name: 'bids',
    initialState,
    reducers: {
        resetHiringStatus: (state) => {
            state.hiringStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBidsByGig.pending, (state) => { state.loading = true; })
            .addCase(fetchBidsByGig.fulfilled, (state, action) => { state.loading = false; state.bids = action.payload; })
            .addCase(fetchBidsByGig.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(hireFreelancer.pending, (state) => { state.hiringStatus = 'loading'; })
            .addCase(hireFreelancer.fulfilled, (state) => {
                state.hiringStatus = 'succeeded';
                // Note: We might want to refresh the bids list after hiring
            })
            .addCase(hireFreelancer.rejected, (state, action) => {
                state.hiringStatus = 'failed';
                state.error = action.payload;
            })

            .addCase(fetchMyApplications.pending, (state) => { state.loading = true; })
            .addCase(fetchMyApplications.fulfilled, (state, action) => { state.loading = false; state.myApplications = action.payload; })
            .addCase(fetchMyApplications.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(submitBid.pending, (state) => { state.loading = true; })
            .addCase(submitBid.fulfilled, (state) => { state.loading = false; })
            .addCase(submitBid.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { resetHiringStatus } = bidSlice.actions;
export default bidSlice.reducer;
