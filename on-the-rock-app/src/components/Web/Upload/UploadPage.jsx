import { useState } from "react";
import uploadIcon from '../../../assets/upload_icon.svg';
import DesktopHorizontal from "../Streaming/DesktopHorizontal";
import SideBar from '../MainPage/SideBar'; // 사이드바 컴포넌트 추가
import lock from '../../../assets/lock.svg';
import unlock from '../../../assets/unlock.svg';

export const WebUpload = () => {
  const [hashtags, setHashtags] = useState([]); // 해시태그 리스트
  const [inputHashtag, setInputHashtag] = useState(""); // 입력된 해시태그
  const [showAllTags, setShowAllTags] = useState(false); // 모든 해시태그 표시 여부 토글
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 리스트
  const [previews, setPreviews] = useState([]); // 파일 미리보기 URL 리스트
  const [selectedButton, setSelectedButton] = useState("");
  const [isLocked, setIsLocked] = useState(false); // 잠금 상태를 관리하기 위한 state

  // Enter 키를 누르면 해시태그가 리스트에 추가됨
  const handleHashtagInput = (e) => {
    if (e.key === "Enter" && inputHashtag.trim() !== "") {
      setHashtags([...hashtags, inputHashtag.trim()]); // 해시태그 추가
      setInputHashtag(""); // 입력창 초기화
    }
  };

  // 해시태그 삭제
  const removeHashtag = (index) => {
    setHashtags(hashtags.filter((_, i) => i !== index)); // 인덱스로 해시태그 삭제
  };

  // 5개까지만 해시태그 표시
  const toggleShowAllTags = () => {
    setShowAllTags(!showAllTags); // 모든 해시태그 표시 여부 토글
  };

  // 파일을 선택하면서 파일 리스트와 미리보기 URL을 업데이트
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // 파일 리스트 가져오기
    setUploadedFiles([...uploadedFiles, ...files]); // 파일 리스트 업데이트

    const newPreviews = files.map((file) => URL.createObjectURL(file)); // 파일 미리보기 URL 생성
    setPreviews([...previews, ...newPreviews]); // 미리보기 URL 리스트 업데이트
  };

  // 파일 미리보기 삭제
  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index)); // 인덱스로 파일 삭제
    setPreviews(previews.filter((_, i) => i !== index)); // 인덱스로 미리보기 삭제
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  const renderActionButton = (buttonType, label) => {
    const isSelected = selectedButton === buttonType;
    const buttonClasses = isSelected
      ? buttonType === "success"
        ? "bg-check text-white"
        : "bg-accent text-white"
      : "bg-white text-textBlack hover:bg-opacity-80 border shadow-md";

    const hoverClasses = buttonType === "success" ? "hover:bg-check hover:text-white" : "hover:bg-accent hover:text-white";

    return (
      <button
        className={`font-bold py-[5vh] rounded-2xl cursor-pointer transition-colors duration-200 ${buttonClasses} ${hoverClasses}`}
        onClick={() => handleButtonClick(buttonType)}
      >
        {label}
      </button>
    );
  };

  // 표시할 해시태그 결정 (모두 표시할지, 일부만 표시할지)
  const displayedTags = showAllTags ? hashtags : hashtags.slice(0, 5);

  // 잠금 여부 설정
  const handleLockButton = () => {
    setIsLocked(prevState => !prevState);
  }

  return (
    <div className="w-full mt-[70px] relative box-border flex flex-col items-center font-sans">
      <DesktopHorizontal text="Upload" />
      <div className="flex align-center w-full h-screen">
        <div className="mr-4">
          <SideBar />
        </div>
        <div className="flex-1 flex flex-col items-center p-5">
          <div className="w-[80%] mt-5"> {/* 업로드 섹션 너비 조정 */}
            <input
              type="text"
              placeholder="Climbing Studio"
              className="w-full bg-white rounded-2xl py-4 pl-8 text-[2.5vh] border shadow-md focus:border-secondary focus:outline-none focus:ring-2"
            />
            <div className="w-full max-w-[200vh] bg-white rounded-2xl py-3 pl-5 mt-[2vh] flex items-center border shadow-md">
              <div className="flex items-center gap-[1vw]">
                <span className="text-secondary font-bold">+</span>
                <input
                  type="text"
                  placeholder="해시 태그 추가"
                  className="flex-grow border-none rounded-lg bg-transparent text-[2vh] text-textBlack p-2 font-sans focus:border-secondary focus:outline-none focus:ring-2"
                  value={inputHashtag}
                  onChange={(e) => setInputHashtag(e.target.value)}
                  onKeyDown={handleHashtagInput}
                />
              </div>
            </div>
            {hashtags.length > 0 && (
              <div className="mt-[2vh] p-2  ">
                <div className="flex flex-wrap gap-[1vh]">
                  {displayedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-secondary text-white p-[0.5vh_1vw] rounded-xl text-[1.75vh] font-sans flex items-center"
                    >
                      {`# ${tag}`}
                      <button
                        className="bg-none border-none text-white ml-2 cursor-pointer text-[1.5vh] font-sans"
                        onClick={() => removeHashtag(index)}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
                {hashtags.length > 5 && (
                  <button
                    className="bg-none border-none text-textBlack cursor-pointer text-[2vh] mt-[1vh] font-sans"
                    onClick={toggleShowAllTags}
                  >
                    {showAllTags ? "줄이기" : "더 보기"}
                  </button>
                )}
              </div>
            )}
            <div className="bg-white rounded-2xl mt-[2vh] overflow-hidden border shadow-md">
              <div className="p-8">
                <textarea
                  placeholder="내용을 입력해 주세요."
                  className="w-full h-[200px] bg-white rounded-xl border-none resize-none text-[2.5vh] p-[2vh] mt-[1vh] focus:border-secondary focus:outline-none focus:ring-2"
                />
              </div>
            </div>
            <div className="flex flex-row lg:flex-row lg:gap-5 md:gap-3 mt-[2vh]">
              <div className="w-[80%]">
                <div className="bg-white rounded-2xl flex flex-col items-center justify-center h-[30vh] cursor-pointer border shadow-md">
                  <div
                    className="relative"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <img src={uploadIcon} alt="Upload icon" className="w-[8vh] h-[8vh] mb-[1.5vh]" />
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex flex-row flex-wrap gap-[1vh] overflow-x-auto p-[1vh_2vw] mt-[2vh]">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative min-w-[10%] h-[10vh] rounded-xl overflow-hidden shadow-md transition-transform duration-200 hover:scale-105">
                        <button
                          className="absolute top-[0.5vh] right-[0.5vh] bg-white bg-opacity-80 rounded-full px-[0.5vh] cursor-pointer text-[1.5vh] text-textBlack"
                          onClick={() => removeFile(index)}
                        >
                          x
                        </button>
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-[20%] flex flex-col justify-center gap-4">  
                {renderActionButton("success", "성 공")}
                {renderActionButton("fail", "실 패")}
              </div>
            </div>
            <div className="flex justify-end mt-5 mb-5 gap-3 h-12">
              <button
                onClick={handleLockButton}
                className="bg-white text-primary font-bold p-3 rounded-lg border"
              >
                {isLocked ? (
                  <img src={lock} alt="잠금" className="w-6 h-6 object-contain" />
                ) : (
                  <img src={unlock} alt="잠금 해제" className="w-6 h-6 object-contain" />
                )}
              </button>
              <button className="bg-secondary text-white font-bold p-3 rounded-lg transition-colors duration-200 hover:bg-white hover:text-textBlack border">
                업로드
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebUpload;
