import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/streaming"; // streaming API 모듈 임포트

// 비동기 Thunk 함수들
export const startStreamingSession = createAsyncThunk(
	"streaming/startStreamingSession",
	async (req, { rejectWithValue }) => {
		try {
			return await api.startStreamingSession(req);
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

export const stopStreamingSession = createAsyncThunk(
	"streaming/stopStreamingSession",
	async (req, { rejectWithValue }) => {
		try {
			return await api.stopStreamingSession(req);
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

export const joinStreamingSession = createAsyncThunk(
	"streaming/joinStreamingSession",
	async (sessionId, { rejectWithValue }) => {
		try {
			return await api.joinStreamingSession(sessionId);
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

export const getActiveStreamingList = createAsyncThunk(
	"streaming/getActiveStreamingList",
	async (_, { rejectWithValue }) => {
		try {
			return await api.getActiveStreamingList();
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

// 초기 상태
const initialState = {
	streamingSessions: [],
	currentSession: null,
	status: "idle",
	error: null,
};

// Slice 생성
const streamingSlice = createSlice({
	name: "streaming",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(startStreamingSession.pending, (state) => {
				state.status = "loading";
			})
			.addCase(startStreamingSession.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.currentSession = action.payload;
			})
			.addCase(startStreamingSession.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload; // action.error.message 대신 action.payload 사용
			})
			.addCase(stopStreamingSession.fulfilled, (state) => {
				state.status = "succeeded";
				state.currentSession = null;
			})
			.addCase(joinStreamingSession.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.currentSession = action.payload;
			})
			.addCase(getActiveStreamingList.pending, (state) => {
				state.status = "loading";
			})
			.addCase(getActiveStreamingList.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.streamingSessions = action.payload;
			})
			.addCase(getActiveStreamingList.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload; // action.error.message 대신 action.payload 사용
			});
	},
});

export default streamingSlice.reducer;
