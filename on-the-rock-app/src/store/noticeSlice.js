import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotification, postNotification, deleteNotification } from '../api/notification';

// 초기 상태 설정
const initialState = {
  notifications: [], // 알림 목록
  status: 'idle', // 요청 상태 (idle, loading, succeeded, failed)
  error: null, // 오류 메시지
};

// 비동기 Thunk 함수들
export const fetchNotifications = createAsyncThunk(
  'notice/fetchNotifications', // 액션 타입
  async () => {
    const response = await getNotification(); // 서버로부터 알림 데이터를 가져옴
    return response.data; // 데이터를 반환하여 fulfilled 상태로 전환
  }
);

export const createNotification = createAsyncThunk(
  'notice/createNotification',
  async ({ recipientIds, message }) => {
    const response = await postNotification(recipientIds, message); // 알림을 생성하여 서버에 POST 요청
    return response.data; // 새로 생성된 알림 데이터를 반환하여 fulfilled 상태로 전환
  }
);

export const removeNotification = createAsyncThunk(
  'notice/removeNotification',
  async (notificationId) => {
    await deleteNotification(notificationId); // 서버에서 알림 삭제 요청
    return notificationId; // 삭제된 알림의 ID를 반환하여 fulfilled 상태로 전환
  }
);

// Slice 생성
const noticeSlice = createSlice({
  name: 'notice', // 슬라이스 이름
  initialState, // 초기 상태 설정
  reducers: {}, // 동기적인 리듀서들은 여기 정의 (현재는 없음)
  extraReducers: (builder) => {
    builder
      // fetchNotifications 요청에 대한 리듀서들
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading'; // 요청 상태를 loading으로 변경
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'; // 요청이 성공적으로 완료됨
        state.notifications = action.payload; // 서버에서 받은 알림 데이터를 상태에 저장
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed'; // 요청이 실패함
        state.error = action.error.message; // 오류 메시지를 상태에 저장
      })
      // createNotification 요청에 대한 리듀서들
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.push(action.payload); // 새로운 알림을 상태에 추가
      })
      // removeNotification 요청에 대한 리듀서들
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload // 삭제된 알림을 상태에서 제거
        );
      });
  },
});

export default noticeSlice.reducer; // 생성된 슬라이스의 리듀서를 내보냄
