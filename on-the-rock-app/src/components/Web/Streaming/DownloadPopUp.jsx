import PropTypes from 'prop-types';

const DownloadPopUp = ({ onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg text-center w-[90%] max-w-sm">
        <h2 className="mb-4 text-xl font-bold font-sans text-black">스트리밍이 종료되었습니다.</h2>
        <p className="text-textBlack font-sans font-bold text-md mb-8">저장 여부를 결정하세요.</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={onClose} 
            className="w-32 py-2 font-sans rounded-lg bg-white border text-textBlack font-medium"
          >
            저장하지 않기
          </button>
          <button 
            onClick={onSave} 
            className="w-32 py-2 rounded-lg bg-secondary text-white font-medium border"
          >
            저장하기
          </button>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl cursor-pointer text-black"
        >
          ×
        </button>
      </div>
    </div>
  );
};

DownloadPopUp.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default DownloadPopUp;
