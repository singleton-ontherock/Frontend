const UploadResultPopup = ({ isSuccess, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[80vw] max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">
          {isSuccess ? "업로드 성공!" : "업로드 실패"}
        </h2>
        <p className="text-center text-sm text-gray-700 mb-6">
          {isSuccess
            ? "콘텐츠가 성공적으로 업로드되었습니다."
            : "다시 시도해 주세요."}
        </p>
        <button
          className="bg-secondary text-white py-2 px-4 rounded-lg w-full"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default UploadResultPopup;