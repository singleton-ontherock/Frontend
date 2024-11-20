import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import Cookies from "js-cookie";
import closeIcon from "../../assets/close_white.svg";

const Chatting = ({ className, onClose }) => {
	const [chatData, setChatData] = useState([]);
	const [visibleMessagesCount, setVisibleMessagesCount] = useState(10);
	const clientRef = useRef(null);
	const chattingRoomId = "1"; // 문자열로 변경
	const authToken = Cookies.get("accessToken");
	const chatContainerRef = useRef(null);

	useEffect(() => {
		const client = new Client({
			brokerURL: "wss://ontherock.lol:8000/ws",
			connectHeaders: {
				Authorization: `Bearer ${authToken}`,
			},
			debug: function (str) {
				console.log(str);
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		client.onConnect = function () {
			console.log("Connected to STOMP");

			client.subscribe(`/chat/sub/${chattingRoomId}`, function (message) {
				const receivedMessage = JSON.parse(message.body);
				setChatData((prevData) => [...prevData, receivedMessage]);
			});

			fetchPreviousChats();
		};

		client.onStompError = function (frame) {
			console.error("Broker reported error: " + frame.headers["message"]);
			console.error("Additional details: " + frame.body);
		};

		client.onWebSocketError = function (event) {
			console.error("WebSocket error:", event);
		};

		const fetchPreviousChats = async () => {
			try {
				const response = await axios.get(`api/rooms/${chattingRoomId}`);
				if (response.data && response.data.length > 0) {
					setChatData(response.data);
				} else {
					console.log("채팅 기록이 없습니다.");
				}
			} catch (error) {
				console.error("Error fetching previous chats:", error);
			}
		};

		client.activate();
		clientRef.current = client;

		return () => {
			if (clientRef.current) {
				clientRef.current.deactivate();
			}
		};
	}, [chattingRoomId, authToken]);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chatData]);

	const loadMoreMessages = () => {
		setVisibleMessagesCount((prevCount) => prevCount + 5);
	};

	return (
		<div className={`relative ${className}`}>
			<div className="blur-bottom w-full flex flex-col items-center relative h-[30vh] rounded-sm pb-[10vh]">
				<button
					onClick={onClose}
					className="w-5 h-5 absolute top-0 right-2 text-white"
				>
					<img src={closeIcon} alt="닫기" />
				</button>
				<div
					ref={chatContainerRef}
					className="w-full h-full mx-auto p-5 overflow-y-auto no-scrollbar"
				>
					<div className="text-center">
						{visibleMessagesCount < chatData.length && (
							<button
								className="mb-2 border-none cursor-pointer text-white font-sans"
								onClick={loadMoreMessages}
							>
								이전 채팅 더보기
							</button>
						)}
					</div>
					<div className="w-full font-sans">
						{chatData.slice(-visibleMessagesCount).map((chat, index) => (
							<p className="mb-2" key={index}>
								<span className="text-black font-bold">{chat.chatUser}</span>
								<span className="text-black font-normal ml-3">
									{chat.message}
								</span>
							</p>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

Chatting.propTypes = {
	className: PropTypes.string,
	onClose: PropTypes.func.isRequired,
};

export default Chatting;
