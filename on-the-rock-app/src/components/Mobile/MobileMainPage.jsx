import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "./MobilePostCard";
import LoginPopUp from "../Web/Login/LoginPopUp.jsx";
import { getHotClips } from "../../store/contentsSlice.js";
import SiteInfo from "./MobileSiteInfo.jsx";
import _ from "lodash";
import Select from "react-select";
import { login } from "../../store/userSlice";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { ClimbingBoxLoader } from "react-spinners";

const customStyles = {
	control: (provided, state) => ({
		...provided,
		borderRadius: "1rem",
		padding: "0.1rem",
		backgroundColor: "#8090BF",
		borderColor: state.isFocused ? "#8090BF" : "transparent",
		boxShadow: "#F8EEE1",
		"&:hover": {
			borderColor: "#a2a1a1",
		},
	}),
	menu: (provided) => ({
		...provided,
		borderRadius: "0.5rem",
		backgroundColor: "#ffffff",
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isFocused ? "#8090BF" : "#ffffff",
		color: state.isFocused ? "#ffffff" : "a2a1a1",
		fontStyle: "sans",
		borderRadius: "0.5rem",
		margin: "0px 3px",
		width: "95%",
	}),
	placeholder: (provided) => ({
		...provided,
		color: "#ffffff",
	}),
	singleValue: (provided) => ({
		...provided,
		color: "#ffffff",
	}),
};

function MainPage() {
	const user = useSelector((state) => state.user || []);
	const dispatch = useDispatch();
	const {
		hotClips = [],
		status,
		error,
	} = useSelector((state) => state.contents);

	const [scrollCnt, setScrollCnt] = useState(0);
	const [showLoginPopup, setShowLoginPopup] = useState(false);
	const [hasShownPopup, setHasShownPopup] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);
	const [postCardHeight, setPostCardHeight] = useState(0);
	const postCardRef = useRef(null);
	const containerRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);

	// 서버로부터 인기 클립을 가져오는 API 호출
	useEffect(() => {
		if (status === "idle" && !hotClips.length) {
			dispatch(getHotClips());
		}
	}, [dispatch, status, hotClips.length]);

	useEffect(() => {
		if (status === "succeeded" && hotClips.length > 0) {
			setIsLoading(false);
		}
	}, [status, hotClips]);

	// 로그인 팝업을 열기 위한 함수
	const openLoginPopUp = useCallback(() => {
		if (!showLoginPopup && !hasShownPopup) {
			setShowLoginPopup(true);
			setHasShownPopup(true);
		}
	}, [showLoginPopup, hasShownPopup]);

	// 로그인 팝업을 닫기 위한 함수
	const closeLoginPopUp = useCallback(() => {
		setShowLoginPopup(false);
		setScrollCnt(0);
		setHasShownPopup(false);
	}, []);

	// 정렬 옵션 변경 핸들러
	const handleSelectChange = (option) => {
		setSelectedOption(option);
	};

	// 정렬된 데이터 생성: 최신 순 또는 좋아요 순으로 정렬
	const sortedData = useMemo(() => {
		console.log("Original hotClips:", hotClips);
		if (!hotClips || !Array.isArray(hotClips)) {
			return [];
		}

		const clipsWithDetails = hotClips.map((clip) => ({
			...clip,
			author: clip.post.userId,
			likeCount: clip.likeCount,
		}));

		if (selectedOption?.value === "최신 순") {
			return [...clipsWithDetails].sort(
				(a, b) => new Date(b.post.createdAt) - new Date(a.post.createdAt)
			);
		}
		if (selectedOption?.value === "좋아요 순") {
			return [...clipsWithDetails].sort((a, b) => b.likeCount - a.likeCount);
		}

		console.log(clipsWithDetails);
		return clipsWithDetails;
	}, [hotClips, selectedOption]);

	// 로그인 상태 확인 함수
	useEffect(() => {
		const checkLoginStatus = async () => {
			const authToken = Cookies.get("accessToken");
			if (authToken) {
				const res = await axios.get("/api/user/me", {
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				});
				sessionStorage.setItem("userProfile", JSON.stringify(res.data));
				const userProfile = JSON.parse(sessionStorage.getItem("userProfile"));
				if (userProfile) {
					dispatch(login({ userProfile }));
				}
			}
		};

		checkLoginStatus();
	}, [dispatch]);

	// PostCard의 높이를 동적으로 계산하여 상태에 저장
	useEffect(() => {
		const updatePostCardHeight = () => {
			if (postCardRef.current) {
				setPostCardHeight(postCardRef?.current?.clientHeight);
			}
		};

		updatePostCardHeight();
		window.addEventListener("resize", updatePostCardHeight);

		return () => window.removeEventListener("resize", updatePostCardHeight);
	}, []);

	// PostCard들을 렌더링하는 함수
	const renderPostCards = useCallback(
		(isLoggedIn) => {
			if (!sortedData) return null;
			const windowHeight = window.innerHeight;
			const cardsPerColumn = postCardHeight
				? Math.floor(windowHeight / (postCardHeight * 1.1))
				: 1;

			const maxCards = isLoggedIn ? (sortedData ? sortedData.length : 0) : 6;

			return Array.from({ length: Math.ceil(maxCards / 2) }).map((_, i) => {
				const cardGroup = Array.from({ length: 2 })
					.map((_, j) => {
						const index = i * 2 + j;
						if (index < maxCards && sortedData && sortedData[index]) {
							return (
								<motion.div
									key={sortedData[index].postId || `post-${index}`}
									className="flex-shrink-0 w-1/2"
									initial={{ opacity: 0, y: 50 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
								>
									{sortedData[index] && (
										<PostCard
											key={sortedData[index]?.postId || `post-${index}`}
											data={sortedData[index]}
											ref={index === 0 ? postCardRef : null}
											likeCount={sortedData[index]?.likeCount}
											author={sortedData[index]?.author}
										/>
									)}
								</motion.div>
							);
						}
						return null;
					})
					.filter(Boolean);

				return (
					<motion.div
						key={`group-${i}`}
						className={`flex justify-between gap-4 py-2 mb-3 w-full`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: i * 0.1 }}
					>
						{cardGroup}
					</motion.div>
				);
			});
		},
		[sortedData, postCardHeight]
	);

	// 스크롤 카운트 증가 로직 (디바운스 적용)
	useEffect(() => {
		if (scrollCnt >= 3 && !user.isLoggedIn && !hasShownPopup) {
			openLoginPopUp();
		}
	}, [scrollCnt, user.isLoggedIn, hasShownPopup, openLoginPopUp]);

	// 스크롤 이벤트 핸들러
	const debouncedScrollHandler = useMemo(
		() =>
			_.debounce((e) => {
				const container = e.target;
				const { scrollHeight, scrollTop, clientHeight } = container;

				if (scrollTop + clientHeight >= scrollHeight - 10) {
					setScrollCnt((prevCnt) => prevCnt + 1);
				}
			}, 200),
		[]
	);

	// 스크롤 이벤트 핸들러를 설정하고 해제
	useEffect(() => {
		const container = containerRef.current;

		if (container) {
			container.addEventListener("scroll", debouncedScrollHandler);
		}

		return () => {
			if (container) {
				container.removeEventListener("scroll", debouncedScrollHandler);
			}
		};
	}, [debouncedScrollHandler, user.isLoggedIn]);

	// API 호출 상태에 따른 UI 처리
	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (status === "failed") {
		return <div>Error: {error}</div>;
	}

	// 메인 페이지 렌더링
	if (isLoading) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
				<ClimbingBoxLoader color="#ffffff" size={12} speedMultiplier={0.8} />
			</div>
		);
	} else {
		return (
			<div className="flex flex-col h-screen w-full font-sans">
				{!user.isLoggedIn && <SiteInfo />}
				{user.isLoggedIn && (
					<div className="absolute top-[18vh] right-1 z-10 rounded-xl p-2">
						<Select
							styles={customStyles}
							value={selectedOption}
							onChange={handleSelectChange}
							placeholder="정렬 기준"
							options={[
								{ value: "최신 순", label: "최신 순" },
								{ value: "좋아요 순", label: "좋아요 순" },
							]}
						/>
					</div>
				)}
				<motion.div
					ref={containerRef}
					className={`overflow-y-auto no-scrollbar box-border flex-1 absolute left-0 right-0 bottom-16 ${
						user.isLoggedIn ? "top-[26vh]" : "top-[28vh]"
					}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex flex-col items-center justify-center gap-3 ms-6 me-10">
						{renderPostCards(user.isLoggedIn)}
					</div>
				</motion.div>

				{showLoginPopup && <LoginPopUp onClose={closeLoginPopUp} />}
			</div>
		);
	}
}

export default MainPage;
