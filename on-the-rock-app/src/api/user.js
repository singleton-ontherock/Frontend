import api from "./index";

export const getUserProfile = (userId) => api.get(`/user/profile/${userId}`);

export const getFollowers = () => api.get("/user/following");

export const getFollowerStatus = () => api.get("/user/following/status");

export const getMyInfo = () => api.get("/user/me");

export const putMyInfo = (nickname) => api.put("/user/me", nickname);

export const postFollow = (followeeId) =>
	api.post(`/user/follow/${followeeId}`);

export const postUnfollow = (followeeId) =>
	api.post(`/user/unfollow/${followeeId}`);

export const postSearch = (keyword) => api.post("/user/search", { keyword });

export const postRegister = (authId, name) =>
	api.post("/user/register", {
		authId,
		name,
	});

export default {
	getUserProfile,
	getFollowers,
	getFollowerStatus,
	getMyInfo,
	putMyInfo,
	postFollow,
	postUnfollow,
	postSearch,
	postRegister,
};
