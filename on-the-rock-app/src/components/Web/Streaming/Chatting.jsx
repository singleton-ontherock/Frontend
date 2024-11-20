import { useState, useEffect } from 'react';
import ChattingWrite from "./ChattingWrite";
import dummyData from '../../../dummy/chatting.json';

// 임예원 (2024.07.22 수정)
const Chatting = ({ className }) => {
  const [chatData, setChatData] = useState([]);
  const [visibleMessagesCount, setVisibleMessagesCount] = useState(10);

  useEffect(() => {
    // 데이터 받아오는 함수
    const fetchData = async () => {
      try {
        // 실제 백엔드 API 엔드포인트 대신 로컬 더미 데이터 사용
        const data = dummyData;

        // 데이터 형식에 맞게 state 업데이트
        if (Array.isArray(data)) {
          setChatData(data);
        } else {
          console.error('Unexpected data format:', data);
          setChatData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddMessage = (user, message) => {
    setChatData([...chatData, { chatUser: user, message, messageTime: new Date().toISOString(), messageAction: "MESSAGE", chatRoomId: "1" }]);
  };

  const loadMoreMessages = () => {
    setVisibleMessagesCount(prevCount => prevCount + 4);
  };

  return (
    <div className={`bg-white shadow-md rounded-md h-[550px] relative w-full flex flex-col items-center ${className}`}>
      <div className="text-coolgray-60 font-bold text-xl font-roboto pt-8 pb-2">채팅창</div>
      <div className="w-full h-full max-w-[800px] mx-auto p-2 overflow-y-auto max-h-[380px] no-scrollbar">
        <div className="flex flex-col items-center text-center">
          {visibleMessagesCount < chatData.length && (
            <button className="mb-3 border-none cursor-pointer bg-transparent text-sm" onClick={loadMoreMessages}>
              이전 채팅 더보기
            </button>
          )}
        </div>
        <div className="max-h-[500px] pl-6 rounded w-full h-full">
          {chatData.slice(-visibleMessagesCount).map((chat, index) => (
            <p className="mb-2" key={index}>
              <span className="font-bold">{chat.chatUser}</span>
              <span className="text-textBlack font-roboto text-base"> {chat.message}</span>
            </p>
          ))}
        </div>
      </div>
      <ChattingWrite className="absolute bottom-5 left-1/2 transform -translate-x-1/2" onAddMessage={handleAddMessage} />
    </div>
  );
};

export default Chatting;
