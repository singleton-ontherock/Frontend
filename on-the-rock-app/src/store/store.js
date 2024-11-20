import { configureStore, createSlice } from "@reduxjs/toolkit";
import userReducer from './userSlice'; // userSlice를 import합니다.
import contentsSlice from "./contentsSlice";


// 앱 관련 store
const appSlice = createSlice({
  name: "app",
  initialState: {
    hotClips: [],
    isLoginPopUpOpen: false,
  },
  reducers: {
    setHotClips: (state, action) => {
      state.hotClips = action.payload;
    },
    toggleLoginPopUp: (state) => {
      state.isLoginPopUpOpen = !state.isLoginPopUpOpen;
    },
  },
});

// 라이브 관련 store
const liveSlice = createSlice({
  name: "live",
  initialState: {
    isLive: false,
  },
  reducers: {
    toggleLive: (state) => {
      state.isLive = !state.isLive;
    },
  },
});

// 알림 관련 store
const alarmSlice = createSlice({
  name: "alarm",
  initialState: {
    isAlarmOpen: false,
  },
  reducers: {
    toggleAlarm: (state) => {
      state.isAlarmOpen = !state.isAlarmOpen;
    },
  },
});

export const { setHotClips, toggleLoginPopUp } = appSlice.actions;
export const { toggleLive } = liveSlice.actions;
export const { toggleAlarm } = alarmSlice.actions;

const store = configureStore({
  reducer: {
    user: userReducer,
    contents: contentsSlice,
    app: appSlice.reducer,
    live: liveSlice.reducer,
    alarm: alarmSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
