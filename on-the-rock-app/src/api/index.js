import axios from "axios";
import Cookies from "cookies-js";

//const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 프록시를 통한 요청
const BASE_URL = "/api";

const instance = axios.create({
	baseURL: BASE_URL,
	headers: {
		// "Content-Type": "application/json",
	},
	withCredentials: true, // 크로스 도메인 쿠키 허용
});

// 요청 인터셉터 설정 (동적으로 토큰 관리하는 방법 => 나중에 이것으로 사용할지 말지 고민)
instance.interceptors.request.use(
	(config) => {
		const token = Cookies.get("accessToken");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// api 에 필요한 instance 정의
export default instance;
