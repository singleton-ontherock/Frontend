import api from "./index";

export const getContents = () => api.get("/contents");

export const getCalenderByMonth = (userId, year, month) =>
	api.get(`/contents/${userId}/calendar?year=${year}&month=${month}`);

export const postContents = (contentData) =>
	api.post("/contents/media", contentData);

export const getUserFeed = (userId) => api.get(`/contents/${userId}/feed`);

export const searchByHashtag = (keyword) =>
	api.get(`/contents/search?keyword=${keyword}`);

export const getFeed = (hashtag, lastIndex) =>
	api.get(`/contents/feed/${hashtag}/${lastIndex}`);

export const getPostDetails = (postId) => api.get(`/contents/${postId}`);

export const deletePost = (postId) => api.delete(`/contents/${postId}`);

export const likePost = (postId, userId) =>
	api.post(`/contents/${postId}/likes?userId=${userId}`);

export const getLikesCount = (postId) => api.get(`/contents/${postId}/likes`);

export const dislikePost = (postId, userId) =>
	api.post(`/contents/${postId}/dislikes?userId=${userId}`);

export const postComment = (postId, userId, commentData) =>
	api.post(`/contents/${postId}/comments?userId=${userId}`, commentData);

export const getComments = (postId) => api.get(`/contents/${postId}/comments`);

export const deleteComment = (commentId) =>
	api.delete(`/contents/comments/${commentId}`);

export const getHotClips = () => api.get("/contents/hotclips");

export const getUserActivity = (userId) =>
	api.get(`/contents/activity/${userId}`);

export const isLikedPost = (postId, userId) =>
	api.get(`/contents/${postId}/likes/status?userId=${userId}`);

export const getExperience = () => api.get("contents/experience");

export const postReport = (postId, reporterId) =>
	api.post("/contents/report", null, {
		params: {
			postId,
			reporterId,
		},
	});

export const getGymSearch = (gym) =>
	api.get("/contents/gym/search", {
		params: {
			gym,
		},
	});

	export const postHashtags = (keyword) =>
		api.post("/contents/hashtags", keyword, {
			headers: {
				'Content-Type': 'text/plain'
			}
		});

export const postHotclips = (data) =>
	api.post("/contents/batch/hotclips", data, {
		headers: {
			"Content-Type": "text/plain",
		},
	});

// 게시글에 해시태그 붙이기
export const addHashtagsToPost = (postId, hashtags) =>
	api.post(`/contents/${postId}/hashtags`, hashtags, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

export default {
	getCalenderByMonth,
	postContents,
	getUserFeed,
	searchByHashtag,
	getFeed,
	getPostDetails,
	deletePost,
	likePost,
	getLikesCount,
	dislikePost,
	postComment,
	getComments,
	deleteComment,
	getHotClips,
	getUserActivity,
	getExperience,
	postReport,
	getGymSearch,
	postHashtags,
	postHotclips,
	addHashtagsToPost
};
