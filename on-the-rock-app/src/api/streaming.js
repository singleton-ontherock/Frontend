import api from "./index";
// 스트리밍 방 생성
export const startStreamingSession = async (req) => {
	const userProfile = sessionStorage.getItem("userProfile");
	const userId = JSON.parse(userProfile).id;
	console.log("처음 userId는 이거야 : " + userId);
	let demoUserId = "";

	if (!userId) {
		demoUserId = "12345";
	}

	const requestBody = {
		sessionId: req.sessionId,
		userId: userId || demoUserId,
	};

	const response = await api.post("/streaming/start", requestBody, {
		headers: {
			"X-User-Id": userId || demoUserId,
			"Content-Type": "application/json",
		},
	});

	console.log("Response : !!!!!!! : ");
	console.log(response);
	return response.data;
};

// 스트리밍 방 종료
export const stopStreamingSession = async (sessionId) => {
	const userProfile = sessionStorage.getItem("userProfile");
	const userId = JSON.parse(userProfile).id;
	console.log("종료 ㄱ ㄱ");
	console.log(sessionId);

	const response = await api.delete(`/streaming/${sessionId}`, {
		headers: {
			"X-User-Id": userId,
			"Content-Type": "application/json",
		},
		data: {
			userId,
			sessionId: sessionId,
		},
	});
	return response.data;
};

// 스트리밍 세션 참여
export const joinStreamingSession = async (sessionId) => {
	const userProfile = sessionStorage.getItem("userProfile");
	const userId = JSON.parse(userProfile).id;
	const response = await api.post(
		`/streaming/${sessionId}`,
		{
			sessionId,
			userId,
		},
		{
			headers: {
				"X-User-Id": userId,
			},
		}
	);
	return response.data;
};

// 스트리밍 목록 조회
export const getActiveStreamingList = async () => {
	const response = await api.get("/streaming/list");
	return response.data;
};

export default {
	startStreamingSession,
	stopStreamingSession,
	joinStreamingSession,
	getActiveStreamingList,
};
