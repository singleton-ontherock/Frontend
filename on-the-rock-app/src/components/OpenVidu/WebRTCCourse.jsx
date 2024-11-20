import { useState, useEffect, useCallback } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import Session from "./Session";
import { useLocation, useParams } from "react-router-dom";

function WebRTCCourse() {
	const { course_id } = useParams();
	const location = useLocation();
	const { memberId } = location.state || {}; // state가 없을 경우를 대비

	const [session, setSession] = useState("");
	const [subscriber, setSubscriber] = useState(null);
	const [publisher, setPublisher] = useState(null);
	const [OV, setOV] = useState(null);

	const OPENVIDU_SERVER_URL = `http://ontherock.lol:4443`;
	const OPENVIDU_SERVER_SECRET = "ontherock-openvidu";

	const joinSession = () => {
		const OVs = new OpenVidu();
		setOV(OVs);
		setSession(OVs.initSession());
	};

	useEffect(() => {
		joinSession();
	}, []);

	const leaveSession = useCallback(() => {
		if (session) session.disconnect();

		setOV(null);
		setSession("");
		setSubscriber(null);
		setPublisher(null);
	}, [session]);

	useEffect(() => {
		window.addEventListener("beforeunload", leaveSession);
		return () => {
			window.removeEventListener("beforeunload", leaveSession);
		};
	}, [leaveSession]);

	useEffect(() => {
		if (session === "") return;

		session.on("streamDestroyed", (event) => {
			if (subscriber && event.stream.streamId === subscriber.stream.streamId) {
				setSubscriber(null);
			}
		});
	}, [subscriber, session]);

	useEffect(() => {
		if (session === "") return;

		session.on("streamCreated", (event) => {
			const subscribers = session.subscribe(event.stream, "");
			setSubscriber(subscribers);
		});

		const createSession = async (sessionIds) => {
			console.log(2);
			try {
				const data = JSON.stringify({ customSessionId: sessionIds });
				const response = await axios.post(
					`${OPENVIDU_SERVER_URL}/api/sessions`,
					data,
					{
						headers: {
							Authorization: `Basic ${btoa(
								`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
							)}`,
							"Content-Type": "application/json",
						},
					}
				);

				return response.data;
			} catch (error) {
				const errorResponse = error?.response;

				if (errorResponse?.status === 409) {
					return sessionIds;
				}

				console.error("Session creation failed:", error);
				return "";
			}
		};

		const createToken = (sessionIds) => {
			console.log(3);
			console.log("세션 아이디 뭐냐 ?? " + sessionIds);
			return new Promise((resolve, reject) => {
				const data = {};
				axios
					.post(
						`${OPENVIDU_SERVER_URL}/api/sessions/${sessionIds}/connections`,
						data,
						{
							headers: {
								Authorization: `Basic ${btoa(
									`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
								)}`,
								"Content-Type": "application/json",
							},
						}
					)
					.then((response) => {
						resolve(response.data);
						console.log("토큰 생성 잘 되었다!");
					})
					.catch((error) => {
						console.error("Token creation failed:", error);
						reject(error);
					});
			});
		};

		const getToken = async () => {
			console.log(1);
			try {
				const sessionIds = await createSession(course_id);
				const token = await createToken(sessionIds);
				return token;
			} catch (error) {
				console.error("Failed to get token:", error);
				throw new Error("Failed to get token.");
			}
		};

		getToken()
			.then((token) => {
				session
					.connect(token)
					.then(() => {
						if (OV) {
							const publishers = OV.initPublisher(undefined, {
								audioSource: undefined,
								videoSource: undefined,
								publishAudio: true,
								publishVideo: true,
								mirror: false,
							});

							setPublisher(publishers);
							session
								.publish(publishers)
								.then(() => {})
								.catch((publishError) => {
									console.error("Publishing failed:", publishError);
								});
						}
					})
					.catch((connectError) => {
						console.error("Session connection failed:", connectError);
					});
			})
			.catch((tokenError) => {
				console.error("Token acquisition failed:", tokenError);
			});
	}, [session]);

	return (
		<div id="session">
			<div className="block w-full h-full p-6 bg-white border border-gray-200 rounded-lg shadow text-center">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{course_id}번 강의
				</h5>
				<Session
					publisher={publisher}
					publisher_id={memberId}
					subscriber={subscriber}
				/>
			</div>
		</div>
	);
}

export default WebRTCCourse;
