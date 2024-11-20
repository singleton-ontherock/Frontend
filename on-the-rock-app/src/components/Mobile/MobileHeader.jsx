import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginPopUp from "../Web/Login/LoginPopUp.jsx";
import { toggleLoginPopUp } from "../../store/store.js";
import { logout } from "../../store/userSlice.js";
import { useSwipeable } from "react-swipeable";
import logo from "../../assets/Logo.png";
import alarmIcon from "../../assets/alarm.svg";
import defaultImg from "../../assets/default_profile.png";
import Cookies from "cookies-js";
import api from "../../api/index.js";
// import { getFollowerStatus } from "../../store/userSlice.js";

const HeaderNavMobileLogin = () => {
	const dispatch = useDispatch();
	const isLoginPopUpOpen = useSelector((state) => state.app.isLoginPopUpOpen);
	const user = useSelector((state) => state.user);
	// const followerStatus = useSelector((state) => state.user.followerStatus);
	const navigate = useNavigate();
	const navRef = useRef(null);

	const [notifications, setNotifications] = useState([]);
	const [hasNewNotification, setHasNewNotification] = useState(false);
	const [userFollower, setUserFollower] = useState([]);

	// useEffect(() => {
	// 	dispatch(getFollowerStatus());
	// });

	const fetchUserFollowerAndStreaming = async () => {
		const authToken = Cookies.get("accessToken");

		if (!authToken) {
			console.error("No authentication token found");
			return;
		}

		try {
			const response = await api.get("/user/following"); //status 가 흔히 에러가 발생해서 임시방편
			const followers = response.data;
			//console.log("팔로워들 상태", followers);
			setUserFollower(followers);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const storedFollowers = sessionStorage.getItem("userFollower");

		if (storedFollowers) {
			try {
				setUserFollower(JSON.parse(storedFollowers));
			} catch (error) {
				console.error(
					"Failed to parse userFollower data from session storage:",
					error
				);
				fetchUserFollowerAndStreaming();
			}
		} else {
			fetchUserFollowerAndStreaming();
		}
	}, []);

	const openLoginPopUp = () => {
		dispatch(toggleLoginPopUp());
	};

	const handleLogout = () => {
		// sessionStorage에서 userFollower 삭제
		/// sessionStorage.removeItem("userFollower");

		dispatch(logout());
		navigate("/");
	};

	const handleClick = () => {
		if (user.isLoggedIn) {
			handleLogout();
		} else {
			openLoginPopUp();
		}
	};

	const goToOtherInfo = (id) => {
		console.log(id);
		console.log("user", sessionStorage.getItem("userProfile"));
		navigate(`/userPage/${id}`);
	};

	const goToOtherStreaming = (id) => {
		navigate(`/streaming/${id}`);
	};

	const goToHome = () => {
		if (window.location.pathname === "/") {
			window.location.reload();
		} else {
			navigate("/");
		}
	};

	const swipeHandlers = useSwipeable({
		onSwipedLeft: () => {
			if (navRef.current) {
				navRef.current.scrollLeft += 100;
			}
		},
		onSwipedRight: () => {
			if (navRef.current) {
				navRef.current.scrollLeft -= 100;
			}
		},
		trackMouse: true,
		preventDefaultTouchmoveEvent: true,
	});

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const authToken = Cookies.get("accessToken");
				if (!authToken) {
					console.error("No authentication token found");
					return;
				}

				const response = await api.get("/sender/notification");
				setNotifications(response.data);
				setHasNewNotification(response.data.length > 0);
			} catch (error) {
				console.error("Failed to fetch notifications:", error);
			}
		};

		fetchNotifications();
		const intervalId = setInterval(fetchNotifications, 60000);

		return () => clearInterval(intervalId);
	}, []);

	const handleNotificationClick = () => {
		navigate("/alarm");
		setHasNewNotification(false);
	};

	return (
		<header className="w-full h-[8vh] fixed top-0 left-0 z-50 bg-white border-b">
			<div className="w-full h-full flex items-center justify-between px-4 pt-3 pb-2">
				<div className="flex items-center justify-start w-[100px] ml-3">
					{user.isLoggedIn && (
						<div
							onClick={handleNotificationClick}
							className="cursor-pointer relative"
						>
							<img
								className="w-7 h-7 md:w-7 md:h-7 lg:w-8 lg:h-8"
								src={alarmIcon}
								alt="Alarm"
							/>
							{hasNewNotification && (
								<span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
							)}
						</div>
					)}
				</div>
				<div className="flex items-center justify-center flex-1">
					<div onClick={goToHome} className="cursor-pointer">
						<img className="w-[140px] h-[30px]" src={logo} alt="Logo" />
					</div>
				</div>
				<div className="flex items-center justify-end w-[120px] gap-3">
					<button
						className="p-1 w-full max-w-[60px] h-[30px] bg-secondary text-white rounded-md cursor-pointer text-xs shadow-sm font-sans"
						onClick={handleClick}
					>
						{user.isLoggedIn ? "로그아웃" : "로그인"}
					</button>
				</div>
			</div>
			{user.isLoggedIn && (
				<div className="w-full h-full flex items-center justify-center py-8 bg-white border-b">
					<nav
						ref={navRef}
						{...swipeHandlers}
						className="flex items-center justify-start w-full px-5 overflow-x-auto no-scrollbar cursor-grab gap-4"
					>
						{/* 스트리밍 중인 팔로워 */}
						{console.log("follower", userFollower)}
						{userFollower
							.filter((follower) => follower.streamingSessionId)
							.map((follower, index) => (
								<div
									key={`${follower.id}-${index}`} // 고유한 key를 생성하기 위해 userId와 index 조합
									className="h-full min-w-[50px] md:min-w-[60px] lg:min-w-[70px] flex items-center justify-center cursor-pointer relative"
									onClick={() => goToOtherStreaming(follower.id)}
								>
									<img
										className="w-11 h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full border-[3px] border-accent object-cover"
										src={follower.profilePicture || defaultImg}
										alt={follower.name || "User"}
									/>
									<img
										className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
										src={defaultImg}
										alt="Streaming"
									/>
								</div>
							))}

						{/* 스트리밍 중이 아닌 팔로워 */}
						{userFollower
							.filter((follower) => !follower.streamingSessionId)
							.map((follower, index) => (
								<div
									key={`${follower.id}-${index}`}
									className="h-full min-w-[50px] md:min-w-[60px] lg:min-w-[70px] flex items-center justify-center cursor-pointer"
									onClick={() => goToOtherInfo(follower.id)}
								>
									<img
										className="w-11 h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover"
										src={follower.profilePicture || defaultImg}
										alt={follower.nickname}
									/>
								</div>
							))}
					</nav>
				</div>
			)}
			{isLoginPopUpOpen && <LoginPopUp closePopUp={openLoginPopUp} />}
		</header>
	);
};

export default HeaderNavMobileLogin;
