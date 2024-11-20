import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLive } from "../../store/store";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import streamingAPI from "../../api/streaming";
import { getMyInfo } from "../../store/userSlice";
import Session from "../OpenVidu/Session";
import DownloadPopUp from "../Web/Streaming/DownloadPopUp";
import { OpenVidu } from "openvidu-browser";

const StreamingVideo = () => {
	const [showPopup, setShowPopup] = useState(false);
	const isLive = useSelector((state) => state.live.isLive);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sessionId: routeSessionId } = useParams(); // URL의 sessionId
	const [publisher, setPublisher] = useState(null);
	const [subscriber, setSubscriber] = useState([]);
	const [sessionId, setSessionId] = useState(routeSessionId || "");
	const myInfo = useSelector((state) => state.user.userProfile);
	const [session, setSession] = useState(null);

	useEffect(() => {
		if (!myInfo) dispatch(getMyInfo());
		console.log(myInfo);
	}, []);

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			if (publisher) {
				console.log("Cleaning up before unloading...");
				publisher.publishAudio(false);
				publisher.publishVideo(false);
				const streamTrackList = publisher.stream.getMediaStream().getTracks();
				streamTrackList.forEach((track) => track.stop());
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [navigate]);

	const initializeSession = async () => {
		const OV = new OpenVidu();
		const newSession = OV.initSession();
		setSession(newSession);
		return newSession;
	};

	const handleToggleLive = async () => {
		if (isLive) {
			if (publisher) {
				// 스트림과 관련된 오류를 방지하기 위한 검증
				if (publisher.stream && publisher.stream.getMediaStream()) {
					const streamTrackList = publisher.stream.getMediaStream().getTracks();
					streamTrackList.forEach((track) => track.stop());
					publisher.publishAudio(false);
					publisher.publishVideo(false);
				}
				await streamingAPI.stopStreamingSession(sessionId);
			}

			setPublisher(null);
			setSession(null);
			removeChatData();
			setShowPopup(true);
			dispatch(toggleLive());
			setSessionId("");
			navigate("/");
		} else {
			try {
				const OV = new OpenVidu();
				const req = { sessionId: "1" };
				const result = await streamingAPI.startStreamingSession(req);
				const token = result.token;


				setSessionId(result.sessionId);

				if (!session) {
					const newSession = await initializeSession();
					setSession(newSession);

					newSession.on("streamCreated", (event) => {
						const newSubscriber = newSession.subscribe(event.stream, undefined);
						setSubscriber((prev) => [...prev, newSubscriber]);
					});

					newSession.on("connectionCreated", (event) => {
						console.log(
							"Connection " + event.connection.connectionId + " created"
						);
					});
				}

				if (session) {
					const metadata = JSON.stringify({
						id: myInfo.id,
						nickname: myInfo.nickname,
						profilePicture: myInfo.profilePicture,
					});


					await session.connect(token, metadata);

					const newPublisher = OV.initPublisher(undefined, {
						audioSource: true,
						videoSource: true,
						publishAudio: true,
						publishVideo: true,
						resolution: "640x480",
						frameRate: 30,
						mirror: false,
					});

					session.publish(newPublisher);
					setPublisher(newPublisher);
					dispatch(toggleLive());
					navigate(`/streaming/${sessionId}`);
				} else {
					console.error("Session is not initialized. Cannot start publishing.");
				}
			} catch (error) {
				console.error("Error in handleToggleLive:", error);
			}
		}
	};

	const joinExistingSession = async () => {
		try {
			//const OV = new OpenVidu();

			if (!session) {
					const newSession = await initializeSession();
					setSession(newSession);

					newSession.on("streamCreated", (event) => {
						const newSubscriber = newSession.subscribe(event.stream, undefined);
						setSubscriber((prev) => [...prev, newSubscriber]);
					});

					newSession.on("connectionCreated", (event) => {
						console.log("Connection created: " + event.connection.connectionId);
					});

					const token = await streamingAPI.joinStreamingSession(routeSessionId).token;
					const metadata = JSON.stringify({
						id: myInfo.id,
						nickname: myInfo.nickname,
						profilePicture: myInfo.profilePicture,
					});

					console.log("[MobileStreamingVideo::joinExistingSession] Generated token for session:", token);
					await newSession.connect(token, metadata);
					console.log("[MobileStreamingVideo::joinExistingSession] Session is connected.");

			}
		} catch (error) {
			console.error("Error joining session:", error);
		}
	};

	useEffect(() => {
		if (routeSessionId) {
			joinExistingSession(); // If URL contains a session ID, join that session
		}
	}, [routeSessionId]);

	const removeChatData = async () => {
		try {
			const res = await axios.delete(`api/rooms/${sessionId}`);
			console.log("Chat data removed successfully:", res.data);
		} catch (error) {
			console.error("Error removing chat data:", error.response ? error.response.data : error.message);
		}
	};

	const handleClosePopup = () => setShowPopup(false);

	const handleSave = () => {
		dispatch(toggleLive());
		setShowPopup(false);
	};

	return (
		<>
			<Session
				subscriber={subscriber}
				publisher={publisher}
				publisher_id={1}
				isLive={isLive}
				onToggleLive={handleToggleLive}
			/>
			{showPopup && (
				<DownloadPopUp onClose={handleClosePopup} onSave={handleSave} />
			)}
		</>
	);
};

export default StreamingVideo;
