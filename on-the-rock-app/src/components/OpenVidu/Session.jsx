import { useState, useEffect } from "react";
import Chatting from "../Mobile/MobileChatting";
import MobileChattingWrite from "../Mobile/MobileChattingWrite";
import ChattingIcon from "../../assets/chattingIcon.svg";
import Video from "./Video";

function Session({
	subscriber,
	publisher,
	publisher_id,
	isLive,
	onToggleLive,
}) {
	const [subscribers, setSubscribers] = useState([]);
	const [isChattingVisible, setIsChattingVisible] = useState(false);
	const [isWritingVisible, setIsWritingVisible] = useState(false);

	useEffect(() => {
		if (subscriber && subscriber.length > 0) {
			setSubscribers(subscriber);
		}
	}, [subscriber]);

	const handleToggleChatting = () => {
		setIsChattingVisible((prevState) => !prevState);
		setIsWritingVisible((prevState) => !prevState);
	};

	const renderSubscribers = () => {
		// 조건문을 추가하여 publisher 화면만 렌더링
		return (
			<div className="border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
				<div className="flex flex-col justify-center items-center">
					<div className="w-full h-[70vh]">
						<Video streamManager={publisher} />
					</div>
					<div className="mt-2">
						<span className="text-lg font-bold text-gray-800 dark:text-white"></span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="relative flex flex-col w-full h-[70vh]">
			{/* Video and Chatting Section */}
			<div className="flex-grow overflow-hidden relative">
				{isLive && renderSubscribers()}
				{/* 채팅창 */}
				{isChattingVisible && (
					<div className="absolute top-[40vh] left-0 w-full h-full">
						<Chatting onClose={handleToggleChatting} />
					</div>
				)}
			</div>
			{/* Control Section */}
			<div className="absolute bottom-0 left-0 w-full flex justify-center items-center py-8 bg-black bg-opacity-70 blur-top">
				<div className="flex justify-between items-center w-full max-w-[300px]">
					<div className="w-[100px]">
						{!isChattingVisible && (
							<img
								src={ChattingIcon}
								alt="채팅열기"
								onClick={handleToggleChatting}
								className="z-10 h-[35px] cursor-pointer"
							/>
						)}
					</div>
					<button
						onClick={onToggleLive}
						className={`px-2 py-2 cursor-pointer rounded-md ${
							isLive ? "bg-accent text-white" : "bg-secondary text-white"
						}`}
					>
						{isLive ? "라이브 중지" : "라이브 시작"}
					</button>
					<div className="w-[100px]"></div> {/* Placeholder for symmetry */}
				</div>
				{/* 채팅 입력창 */}
				{isWritingVisible && (
					<MobileChattingWrite
						className="absolute top-[13vh] w-full p-1 z-10"
						onAddMessage={(user, message) =>
							console.log(`User: ${user}, Message: ${message}`)
						}
					/>
				)}
			</div>
		</div>
	);
}

export default Session;
