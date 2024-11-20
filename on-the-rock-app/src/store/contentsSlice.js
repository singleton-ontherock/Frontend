import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/contents";
import * as api2 from "../api/user";
// import Cookies from "js-cookie";
// const authToken = Cookies.get("accessToken");

// 사용자 캘린더(월별 게시물) 조회
export const getCalenderByMonth = createAsyncThunk(
	"contents/getCalenderByMonth",
	async ({ userId, year, month }, { rejectWithValue }) => {
		try {
			const response = await api.getCalenderByMonth(userId, year, month);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch calendar by month:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 업로드
export const postContents = createAsyncThunk(
	"contents/postContents",
	async (formData, { rejectWithValue }) => {
		try {
			const response = await api.postContents(formData, {
				method: "POST",
				body: formData,
			});
			return response.data;
		} catch (error) {
			console.error("Failed to post content:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 조회
export const getContents = createAsyncThunk(
	"contents/getContents",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getContents();
			console.log("게시물 전체다", response.data);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 사용자 피드(게시물) 조회
export const getUserFeed = createAsyncThunk(
	"contents/getUserFeed",
	async (userId, { rejectWithValue }) => {
		try {
			const response = await api.getUserFeed(userId);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch user feed:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 해시태그로 게시물 검색
export const searchByHashtag = createAsyncThunk(
	"contents/searchByHashtag",
	async (keyword, { rejectWithValue }) => {
		try {
			const response = await api.searchByHashtag(keyword);
			return response.data;
		} catch (error) {
			console.error("Failed to search by hashtag:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 피드 조회
export const getFeed = createAsyncThunk(
	"contents/getFeed",
	async ({ hashtag, lastIndex }, { rejectWithValue }) => {
		try {
			const response = await api.getFeed(hashtag, lastIndex);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch feed:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 상세 조회
export const getPostDetails = createAsyncThunk(
	"contents/getPostDetails",
	async (postId, { rejectWithValue }) => {
		try {
			const response = await api.getPostDetails(postId);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch post details:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 삭제
export const deletePost = createAsyncThunk(
	"contents/deletePost",
	async (postId, { rejectWithValue }) => {
		try {
			const response = await api.deletePost(postId);
			return response.data;
		} catch (error) {
			console.error("Failed to delete post:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 좋아요
export const likePost = createAsyncThunk(
	"contents/likePost",
	async ({ postId, userId }, { rejectWithValue }) => {
		try {
			// console.log(postId + " " + userId);
			const response = await api.likePost(postId, userId);
			return response.data;
		} catch (error) {
			console.error("Failed to like post:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const isLikedPost = createAsyncThunk(
	"contents/isLikedPost",
	async ({ postId, userId }, { rejectWithValue }) => {
		try {
			const response = await api.isLikedPost(postId, userId);
			return response.data;
		} catch (error) {
			console.error("Failed to check liked post:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 좋아요 수 조회
export const getLikesCount = createAsyncThunk(
	"contents/getLikesCount",
	async (postId, { rejectWithValue }) => {
		try {
			const response = await api.getLikesCount(postId);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch likes count:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 좋아요 취소
export const dislikePost = createAsyncThunk(
	"contents/dislikePost",
	async ({ postId, userId }, { rejectWithValue }) => {
		try {
			const response = await api.dislikePost(postId, userId);
			return response.data;
		} catch (error) {
			console.error("Failed to dislike post:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 댓글 달기
export const postComment = createAsyncThunk(
	"contents/postComment",
	async ({ postId, userId, commentData }, { rejectWithValue }) => {
		try {
			// console.log(postId + " " + userId + " " + commentData);
			const response = await api.postComment(postId, userId, { commentData });
			return response.data;
		} catch (error) {
			console.error("Failed to post comment:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 댓글 조회
export const getComments = createAsyncThunk(
	"contents/getComments",
	async (postId, { rejectWithValue }) => {
		try {
			const response = await api.getComments(postId);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch comments:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 댓글 삭제
export const deleteComment = createAsyncThunk(
	"contents/deleteComment",
	async (commentId, { rejectWithValue }) => {
		try {
			const response = await api.deleteComment(commentId);
			return response.data;
		} catch (error) {
			console.error("Failed to delete comment:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 핫클립 조회
export const getHotClips = createAsyncThunk(
	"contents/getHotClips",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.getHotClips();
			
			
			return response.data;
		} catch (error) {
			console.error("Failed to fetch hot clips:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 사용자 활동 조회
export const getUserActivity = createAsyncThunk(
	"contents/getUserActivity",
	async (userId, { rejectWithValue }) => {
		try {
			const response = await api.getUserActivity(userId);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch user activity:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const getAuthor = createAsyncThunk(
	"contents/getAuthor",
	async (userId, { rejectWithValue }) => {
		try {
			// console.log("Fetching Author.....");
			const response = await api2.getUserProfile(userId);
			// console.log("Fetching Author success...");
			return response.data;
		} catch (error) {
			console.error("Failed to fetch author:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 경험치 검색
export const getExperience = createAsyncThunk(
	"contents/getExperience",
	async (_, { rejectWithValue }) => {
		try {
			// console.log("Fetching experience success...");
			const response = await api.getExperience();
			return response.data;
		} catch (error) {
			console.error("Failed to fetch experience:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글 신고
export const postReport = createAsyncThunk(
	"contents/postReport",
	async ({ postId, reporterId }, { rejectWithValue }) => {
		try {
			const response = await api.postReport(postId, reporterId);
			return response.data;
		} catch (error) {
			console.error("Failed to report post:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 클라이밍장 검색
export const getGymSearch = createAsyncThunk(
	"contents/getGymSearch",
	async (gym, { rejectWithValue }) => {
		try {
			const response = await api.getGymSearch(gym);
			return response.data;
		} catch (error) {
			console.error("Failed to search gym:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 해시태그 추가
export const postHashtags = createAsyncThunk(
	"contents/postHashtags",
	async (keyword, { rejectWithValue }) => {
		try {
			const response = await api.postHashtags(keyword);
			return response.data;
		} catch (error) {
			console.error("Failed to post hashtags:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 게시글에 해시태그 붙이기
export const addHashtagsToPost = createAsyncThunk(
	"contents/addHashtagsToPost",
	async ({ postId, hashtags }, { rejectWithValue }) => {
		try {
			const response = await api.addHashtagsToPost(postId, hashtags);
			return response.data;
		} catch (error) {
			console.error("Failed to add hashtags to post:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// 핫클립 업로드
export const postHotclips = createAsyncThunk(
	"contents/postHotclips",
	async (data, { rejectWithValue }) => {
		try {
			const response = await api.postHotclips(data);
			return response.data;
		} catch (error) {
			console.error("Failed to post hotclips:", error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Slice 생성
const contentsSlice = createSlice({
	name: "contents",
	initialState: {
		calenderByMonth: null,
		userFeed: null,
		postDetails: [], // 배열로 초기화
		likesCount: null,
		comments: [], // 배열로 초기화
		hotClips: [], // 배열로 초기화
		contents: [],
		userActivity: null,
		status: "idle",
		error: null,
		author: null,
		liked: false,
		experience: null, // 경험치 상태 추가
		reportedPosts: [], // 신고된 게시물 저장 상태 추가
		gymSearchResults: [], // 클라이밍장 검색 결과 저장 상태 추가
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getCalenderByMonth.fulfilled, (state, action) => {
				state.calenderByMonth = action.payload;
			})
			.addCase(getUserFeed.fulfilled, (state, action) => {
				state.userFeed = action.payload;
			})
			.addCase(getPostDetails.fulfilled, (state, action) => {
				state.postDetails = action.payload;
			})
			.addCase(getLikesCount.fulfilled, (state, action) => {
				state.likesCount = action.payload;
			})
			.addCase(getComments.fulfilled, (state, action) => {
				state.comments = action.payload;
			})
			.addCase(getContents.fulfilled, (state, action) => {
				state.contents = action.payload || {};
			})
			.addCase(getUserActivity.fulfilled, (state, action) => {
				state.userActivity = action.payload;
			})
			.addCase(getAuthor.fulfilled, (state, action) => {
				state.author = action.payload;
			})
			.addCase(getHotClips.fulfilled, (state, action) => {
				state.hotClips = action.payload;
				sessionStorage.setItem("hotClips", JSON.stringify(state.hotClips));
			})
			.addCase(isLikedPost.fulfilled, (state, action) => {
				state.liked = action.payload;
			})
			.addCase(getExperience.pending, (state) => {
				state.status = "loading";
			})
			.addCase(getExperience.fulfilled, (state, action) => {
				state.experience = action.payload; // 경험치 데이터 저장
				state.status = "succeeded";
			})
			.addCase(getExperience.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || action.error.message; // 에러 메시지 저장
			})
			// 게시글 신고 처리기
			.addCase(postReport.fulfilled, (state, action) => {
				state.reportedPosts.push(action.payload); // 신고된 게시물 저장
			})

			// 클라이밍장 검색 처리기
			.addCase(getGymSearch.fulfilled, (state, action) => {
				state.gymSearchResults = action.payload; // 클라이밍장 검색 결과 저장
			})
			.addMatcher(
				(action) => action.type.endsWith("/pending"),
				(state) => {
					state.status = "loading";
				}
			)
			.addMatcher(
				(action) => action.type.endsWith("/fulfilled"),
				(state) => {
					state.status = "succeeded";
					state.error = null; // 성공 시 에러 초기화
				}
			)
			.addMatcher(
				(action) => action.type.endsWith("/rejected"),
				(state, action) => {
					state.status = "failed";	
					state.error = action.payload || action.error.message; // 에러 메시지 저장
				}
			);
	},
});

export default contentsSlice.reducer;
