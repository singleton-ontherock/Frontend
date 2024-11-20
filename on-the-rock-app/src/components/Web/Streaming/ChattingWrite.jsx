import { useState } from 'react';
import PropTypes from "prop-types";

// 임예원 (2024.07.22 수정)

const ChattingWrite = ({ className, onAddMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      onAddMessage("유저", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className={`h-[50px] w-[250px] ${className}`}>
      <div className="flex items-center bg-white border shadow-md rounded-lg p-2 w-full box-border font-sans">
        <input 
          className="flex-1 bg-white border-none outline-none text-textBlack p-0 px-1 box-border text-textBlack" 
          value={inputValue}
          onChange={handleChange} 
          placeholder="채팅 적기" 
        />
        <button 
          className="rounded-lg bg-secondary text-white text-sm cursor-pointer p-1 ml-1 hover:shadow-md" 
          onClick={handleSubmit}
        >
          전송
        </button>
      </div>
    </div>
  );
};

ChattingWrite.propTypes = {
  className: PropTypes.string,
  onAddMessage: PropTypes.func.isRequired,
};

export default ChattingWrite;
