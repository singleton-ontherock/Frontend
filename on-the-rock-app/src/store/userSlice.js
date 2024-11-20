import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import * as api from "../api/user";

// 유저 프로필 가져오기
export const getUserProfile = createAsyncThunk(
	"user/getUserProfile",
	async (userId, { rejectWithValue }) => {
		try {
			const response = await api.getUserProfile(userId);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 유저의 본인 정보 가져오기
export const getMyInfo = createAsyncThunk(
	"user/getMyInfo",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getMyInfo();
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 팔로워 목록 조회
export const getUserFollowing = createAsyncThunk(
	"user/getUserFollowing",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getFollowers();
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 팔로워들의 상태
export const getFollowerStatus = createAsyncThunk(
	"user/getFollowerStatus",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getFollowerStatus();
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 팔로우하기
export const postFollow = createAsyncThunk(
	"user/postFollow",
	async (followeeId, { rejectWithValue }) => {
		try {
			const response = await api.postFollow(followeeId);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 언팔로우하기
export const postUnfollow = createAsyncThunk(
	"user/postUnfollow",
	async (followeeId, { rejectWithValue }) => {
		try {
			const response = await api.postUnfollow(followeeId);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 유저 검색
export const postSearch = createAsyncThunk(
	"user/postSearch",
	async (keyword, { rejectWithValue }) => {
		try {
			const response = await api.postSearch(keyword);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 유저 정보 업데이트
export const putMyInfo = createAsyncThunk(
	"user/putMyInfo",
	async (nickname, { rejectWithValue }) => {
		try {
			console.log(nickname);
			const response = await api.putMyInfo(nickname);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 유저 등록
export const postRegister = createAsyncThunk(
	"user/postRegister",
	async ({ authId, name }, { rejectWithValue }) => {
		try {
			const response = await api.postRegister({ authId, name });
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

const userSlice = createSlice({
	name: "user",
	initialState: {
		isLoggedIn: JSON.parse(sessionStorage.getItem("isLoggedIn")) || false,
		authToken: Cookies.get("accessToken") || "", // 쿠키에서 토큰을 가져옴
		userId: Cookies.get("userId") || null, // 쿠키에서 userId를 가져옴
		userProfile: JSON.parse(sessionStorage.getItem("userProfile")) || {},
		followers: JSON.parse(sessionStorage.getItem("followers")) || [],
		followerStatus: [],
		searchResults: [],
		status: "idle",
		error: null,
	},
	reducers: {
		login: (state, action) => {
			const { accessToken, userId } = action.payload;

			state.isLoggedIn = true;
			state.userId = userId;

			//testcode
			// Cookies.set('userId',userId);
			// 쿠키에 저장
			// if (!Cookies.get("accessToken")) {
			//   Cookies.set("accessToken", accessToken, { secure: true, sameSite: 'Strict' });
			// }
			// Cookies.set("userId", userId, { secure: true, sameSite: 'Strict' });
			sessionStorage.setItem("isLoggedIn", true);
			// sessionStorage.setItem("userId", userId); // 세션 스토리지에 userId 저장
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.userId = null;
			state.userProfile = {};
			state.followers = [];
			state.followerStatus = []; // 상태 초기화
			console.log("로그아웃");
			// sessionStorage와 쿠키에서 사용자 정보 제거
			sessionStorage.removeItem("isLoggedIn");
			// sessionStorage.removeItem("userId");
			sessionStorage.removeItem("followers");
			sessionStorage.removeItem("userProfile");
			Cookies.remove("accessToken");

			Cookies.remove("userId");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserProfile.pending, (state) => {
				state.status = "loading";
			})
			.addCase(getUserProfile.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.userProfile = action.payload || {};
				sessionStorage.setItem("Profile", JSON.stringify(state.userProfile));
			})
			.addCase(getUserProfile.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(getMyInfo.fulfilled, (state, action) => {
				state.userProfile = action.payload || {};
				sessionStorage.setItem(
					"userProfile",
					JSON.stringify(state.userProfile)
				);
			})
			.addCase(getMyInfo.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(getUserFollowing.fulfilled, (state, action) => {
				state.followers = action.payload || [];
				sessionStorage.setItem("followers", JSON.stringify(state.followers));
			})
			.addCase(getUserFollowing.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(getFollowerStatus.fulfilled, (state, action) => {
				state.followerStatus = action.payload || [];
				sessionStorage.setItem(
					"followerStatus",
					JSON.stringify(state.followerStatus)
				);
				console.log(state.followerStatus);
			})
			.addCase(getFollowerStatus.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(postFollow.fulfilled, (state, action) => {
				state.followers.push(action.payload);
				sessionStorage.setItem("followers", JSON.stringify(state.followers));
			})
			.addCase(postFollow.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(postUnfollow.fulfilled, (state, action) => {
				state.followers = state.followers.filter(
					(follower) => follower.userId !== action.payload.userId // 여기 확인해보기
				);
				sessionStorage.setItem("followers", JSON.stringify(state.followers));
			})
			.addCase(postUnfollow.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(postSearch.fulfilled, (state, action) => {
				state.searchResults = action.payload || [];
			})
			.addCase(postSearch.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(putMyInfo.fulfilled, (state, action) => {
				state.userProfile = action.payload || {};
				sessionStorage.setItem(
					"userProfile",
					JSON.stringify(state.userProfile)
				);
			})
			.addCase(putMyInfo.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(postRegister.fulfilled, (state, action) => {
				state.userProfile = action.payload || {};
				sessionStorage.setItem(
					"userProfile",
					JSON.stringify(state.userProfile)
				);
			})
			.addCase(postRegister.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
