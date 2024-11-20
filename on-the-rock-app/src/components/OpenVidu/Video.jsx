import { useRef, useEffect } from "react";

function Video({ streamManager }) {
	const videoRef = useRef(null);
	const autoplay = true;

	useEffect(() => {
		if (streamManager && videoRef.current) {
			streamManager.addVideoElement(videoRef.current);
		}
	}, [streamManager]);

	return (
		<video autoPlay={autoplay} ref={videoRef} style={{ width: "100%" }}>
			<track kind="captions" />
		</video>
	);
}

export default Video;
