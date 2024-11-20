import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Client } from "@stomp/stompjs";

const MobileChattingWrite = ({ className }) => {
	const [inputValue, setInputValue] = useState("");
	const clientRef = useRef(null);
	const chattingRoomId = "1"; // 문자열로 변경
	const nickname = JSON.parse(sessionStorage.getItem("userProfile"))?.nickname; // 사용자 이름 설정

	useEffect(() => {
		const client = new Client({
			brokerURL: "wss://ontherock.lol:8000/ws",
			connectHeaders: {
				// 필요한 경우 인증 헤더 추가
			},
			debug: function (str) {
				console.log(str);
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		client.onConnect = function () {
			console.log("Connected to STOMP for writing");
		};

		client.activate();
		clientRef.current = client;

		return () => {
			if (clientRef.current) {
				clientRef.current.deactivate();
			}
		};
	}, []);

	const handleChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleSubmit = () => {
		if (inputValue.trim() !== "" && clientRef.current) {
			clientRef.current.publish({
				destination: "/chat/pub",
				body: JSON.stringify({
					chatUser: `${nickname}`,
					message: inputValue,
					messageTime: "",
					messageAction: "MESSAGE",
					chatRoomId: chattingRoomId,
				}),
			});
			setInputValue("");
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div
			className={`flex items-center justify-center ${className} box-border max-w-[35vh]`}
		>
			<input
				className="flex-1 border-2 outline-none border-secondary rounded-md text-textBlack px-2 py-1 box-border mt-2"
				value={inputValue}
				onChange={handleChange}
				onKeyDown={handleKeyPress}
				placeholder="채팅 적기"
			/>
			<button
				className="bg-secondary text-white cursor-pointer px-2 ml-2 mt-2 rounded-md hover:text-coolgray-90 h-[34px] text-xs whitespace-nowrap"
				onClick={handleSubmit}
			>
				전송
			</button>
		</div>
	);
};

MobileChattingWrite.propTypes = {
	className: PropTypes.string,
};

export default MobileChattingWrite;
