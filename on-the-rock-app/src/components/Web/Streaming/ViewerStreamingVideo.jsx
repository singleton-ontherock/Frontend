import { useRef, useState, useEffect, useCallback } from 'react';
import { OpenVidu } from "openvidu-browser";
import streamingAPI from '../../../api/streaming';

const ViewerComponent = ({ sessionId, style }) => {
  // 비디오 스트림을 표시할 비디오 엘리먼트를 참조하기 위한 useRef 훅
  const videoRef = useRef(null);
  // 현재 세션 객체를 관리하기 위한 상태 훅
  const [session, setSession] = useState(null);

  /**
   * 스트리밍 세션에 참여하기 위한 함수
   * useCallback 훅으로 메모이제이션하여 sessionId가 변경될 때만 함수 재생성
   */
  const joinStreamingSession = useCallback(async () => {
    try {
      // 서버에 세션 참여 요청
      const req = { sessionId };
      const res = await streamingAPI.joinStreamingSession(sessionId, req);
      const { token } = res.data; // 서버에서 반환된 연결 토큰

      // FIXME: OpenVidu 객체 생성 함수로 만들어 재사용 권장
      const OV = new OpenVidu();
      // 새로운 세션 객체 생성
      const newSession = OV.initSession();

      // 다른 사용자가 스트림을 게시할 때 트리거되는 이벤트 리스너 추가
      newSession.on('streamCreated', (event) => {
        // 해당 스트림을 구독하여 비디오 엘리먼트에 연결
        newSession.subscribe(event.stream, videoRef.current); // videoRef를 사용해 video element에 연결
      });

      // 세션에 연결
      await newSession.connect(token, { clientData: sessionId });
      // 세션 객체 상태 업데이트
      setSession(newSession);
    } catch (err) {
      // 세션 참여 실패 시 오류 처리
      console.error("스트리밍 세션 참여 실패:", err);
    }
  }, [sessionId]);

  /**
   * 세션에서 나가기 위한 함수
   * useCallback 훅으로 메모이제이션하여 session이 변경될 때만 함수 재생성
   */
  const leaveSession = useCallback(() => {
    if (session) {
      // 세션 연결 해제
      session.disconnect();
      // 세션 상태 초기화
      setSession(null);
    }
    if (videoRef.current) {
      // 비디오 엘리먼트의 스트림을 초기화하여 화면에 표시되는 콘텐츠 제거
      videoRef.current.srcObject = null;
    }
  }, [session]);

  /**
   * 컴포넌트가 마운트될 때 스트리밍 세션에 참여하고,
   * 언마운트될 때 세션에서 나가도록 설정하는 useEffect 훅
   * joinStreamingSession과 leaveSession 함수가 변경될 때만 실행
   */
  useEffect(() => {
    joinStreamingSession(); // 세션에 참여
    return () => {
      leaveSession(); // 세션에서 나가기
    };
  }, [joinStreamingSession, leaveSession]);

  return (
    <div className="relative w-full h-full" style={style}>
      <div className="w-full h-full p-6 bg-white shadow-md rounded-lg flex flex-col justify-between">
        <div className="flex-grow w-full border overflow-hidden relative">
          {/* 비디오 스트림을 표시할 비디오 엘리먼트 */}
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay />
        </div>
        {/* 세션에서 나가기 버튼 */}
        <button
          onClick={leaveSession}
          className="mt-4 px-5 py-2 text-base cursor-pointer rounded bg-accent text-primary"
        >
          시청 종료하기
        </button>
      </div>
    </div>
  );
};

export default ViewerComponent;
