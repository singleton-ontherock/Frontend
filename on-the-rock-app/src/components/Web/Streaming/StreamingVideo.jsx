import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLive } from '../../../store/store';
import DownloadPopUp from './DownloadPopUp';
import thumbnail from '../../../assets/클라이밍_섬네일.jpg';
import { OpenVidu } from "openvidu-browser";
import { startStreamingSession, stopStreamingSession } from '../../../store/streamingSlice';
import Cookies from 'js-cookie';

const Streamer = ({ style }) => {
  const [showPopup, setShowPopup] = useState(false);
  const isLive = useSelector(state => state.live.isLive);
  const dispatch = useDispatch();

  const videoRef = useRef(null);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const OV = useMemo(() => new OpenVidu(), []);
  const [sessionId, setSessionId] = useState(null);

  const startCamera = useCallback(async (currentSession) => {
    try {
      const publisher = OV.initPublisher(videoRef.current, {
        audioSource: true,
        videoSource: true,
        insertMode: 'APPEND',
        mirror: true,
      });

      await currentSession.publish(publisher);
      setPublisher(publisher);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("카메라와 마이크에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.");
    }
  }, [OV]);
  
  const connectToSession = useCallback((sessionId, token) => {
    const newSession = OV.initSession();
    setSession(newSession);

    newSession.on('streamCreated', event => {
      newSession.subscribe(event.stream, videoRef.current);
    });

    newSession.connect(token, { clientData: Cookies.get('userId') })
      .then(() => {
        startCamera(newSession);
      })
      .catch(error => {
        console.error("Error connecting to session:", error);
      });
  }, [OV, startCamera]);
  
  const handleStartStreaming = async () => {
    try {
      const req = {
        userId: parseInt(Cookies.get('userId'), 10),  // 쿠키에서 userId를 가져와 숫자로 변환
        sessionId: "unique-session-id",  // sessionId는 필요에 따라 고유 값으로 설정
      };

      const res = await dispatch(startStreamingSession(req)).unwrap();
      
      const { sessionId, token } = res;
      console.log("sessionId: ", sessionId);
      console.log("token: ", token);
      
      setSessionId(sessionId);
      connectToSession(sessionId, token);
      
      console.log("스트리밍 방 생성 성공:", res);
      dispatch(toggleLive());
    } catch (error) {
      console.error("스트리밍 방 생성 실패:", error);
    }
  };

  const handleStopStreaming = useCallback(async () => {
    if (sessionId) {
      try {
        await dispatch(stopStreamingSession(sessionId)).unwrap();
      } catch (error) {
        console.error("스트리밍 세션 종료 실패:", error);
      }
    }

    if (session) {
      if (publisher) {
        session.unpublish(publisher);
        const mediaStream = publisher.stream.getMediaStream();
        mediaStream.getTracks().forEach(track => track.stop());
        setPublisher(null);
      }
      session.disconnect();
      setSession(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // 명시적으로 종료할 때만 팝업 표시
    if (isLive) {
      setShowPopup(true);
    }
    dispatch(toggleLive()); // 라이브 상태 토글
  }, [sessionId, session, publisher, dispatch, isLive]);

  useEffect(() => {
    // 페이지를 떠날 때 경고 메시지 표시
    const handleBeforeUnload = (e) => {
      if (isLive) {
        const message = '지금은 스트리밍 중입니다. 스트리밍을 종료해주세요!';
        e.preventDefault();
        e.returnValue = message; // 대부분의 브라우저에서 필요함
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isLive]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSave = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative w-full h-full" style={style}>
      <div className="w-full h-full p-6 bg-white shadow-md rounded-md flex flex-col justify-between">
        <div className="flex justify-between p-1">
          <div className="flex">
            <div className={`w-5 h-5 mt-2 content-end rounded-full ml-2 ${isLive ? 'bg-secondary' : 'bg-accent'}`} />
          </div>
          <div className="flex">
            <button
              onClick={isLive ? handleStopStreaming : handleStartStreaming}
              className={`mb-1 px-5 py-2 text-base cursor-pointer rounded-md hover:shadow-md ${isLive ? 'bg-accent text-white' : 'bg-secondary text-white'}`}
            >
              {isLive ? '라이브 끝내기' : '라이브 시작하기'}
            </button>
          </div>
        </div>
        <div className="flex-grow w-full border overflow-hidden relative">
          {isLive ? (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
          ) : (
            <img
              src={thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      {showPopup && <DownloadPopUp onClose={handleClosePopup} onSave={handleSave} />}
    </div>
  );
};

export default Streamer;