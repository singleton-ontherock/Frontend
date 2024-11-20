import PropTypes from 'prop-types';

const AlarmCard = ({ onClose }) => {
  return (
    <div className="w-1/3 h-80 absolute top-16 right-10 rounded-lg bg-white border shadow-md p-4 overflow-y-auto no-scrollbar">
      <div className="flex-grow overflow-y-auto no-scrollbar p-4">
        <h3 className="mb-1 pb-3 font-sans font-bold text-2xl text-textBlack">알림</h3>
        <div className="flex flex-col gap-1 mb-5">
          <div className="p-3 border-b text-sm font-sans text-textBlack">누군가 스트리밍을 시작했습니다.</div>
          <div className="p-3 border-b text-sm font-sans text-textBlack">누군가 좋아요를 눌렀습니다.</div>
          <div className="p-3 border-b text-sm font-sans text-textBlack">누군가 댓글을 달았습니다.</div>
          <div className="p-3 border-b text-sm font-sans text-textBlack">누군가 댓글을 달았습니다.</div>
          <div className="p-3 border-b text-sm font-sans text-textBlack">누군가 댓글을 달았습니다.</div>
          <div className="p-3 border-b text-sm font-sans text-textBlack">누군가 댓글을 달았습니다.</div>
          <div className="p-3 border-b text-sm font-sans text-textBlack">누군가 댓글을 달았.</div>
        </div>
      </div>
      <div className="sticky bottom-0 flex justify-end">
        <button className="w-12 h-8 bg-secondary text-white rounded-lg shadow-md cursor-pointer" onClick={onClose}>
          <span className="text-xs">닫기</span>
        </button>
      </div>
    </div>
  );
};

AlarmCard.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AlarmCard;
