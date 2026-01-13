import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
});

export const markRead = createAsyncThunk('notifications/markRead', async (id, thunkAPI) => {
    try {
        await api.put(`/notifications/${id}/read`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
});

export const markAllRead = createAsyncThunk('notifications/markAllRead', async (_, thunkAPI) => {
    try {
        await api.put('/notifications/all-read');
        return true;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
        unreadCount: 0
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markRead.fulfilled, (state, action) => {
                const note = state.notifications.find(n => n._id === action.payload);
                if (note && !note.isRead) {
                    note.isRead = true;
                    state.unreadCount -= 1;
                }
            })
            .addCase(markAllRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    }
});

export const { addNotification, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
