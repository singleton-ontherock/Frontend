import { useState, useEffect, useRef } from "react";
import dummyData from "../../../dummy/search.json";
import { useNavigate } from "react-router-dom";
import searchIcon from '../../../assets/search.svg';
import closeButton from '../../../assets/close.svg';

const WebSearchPage = ({ onSearchClick }) => {
  const [activeTab, setActiveTab] = useState("account");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const tabMapping = {
    "account": "계정",
    "hashTag": "태그",
    "place": "장소"
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onSearchClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSearchClick]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setHasSearched(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchCancel = () => {
    setSearchTerm("");
    setSearchQuery("");
    setHasSearched(false);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(searchTerm);
      setHasSearched(true);
    }
  };

  const handleResultClick = (result) => {
    if (activeTab === "hashTag") {
      navigate('/feedSearchResult', { state: { searchResult: result, keyword: result } });
    } else {
      console.log(`Selected ${activeTab}: ${result}`);
    }
    onSearchClick();
  };

  const renderSearchResults = () => {
    if (!hasSearched) return null;

    if (!dummyData[activeTab]) {
      console.error(`Invalid tab name: ${activeTab}`);
      return null;
    }

    const results = dummyData[activeTab].filter((item) =>
      item.includes(searchQuery)
    );

    return results.map((item, index) => (
      <div 
        key={index} 
        className="w-4/5 p-3 ml-5 text-center border-b shadow-sm cursor-pointer text-textBlack font-sans"
        onClick={() => handleResultClick(item)}
      >
        {item}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={searchRef} className="relative w-[520px] h-[580px] bg-white rounded-[32px] shadow-lg">
        <button onClick={onSearchClick} className="absolute top-5 right-5 h-5 w-5 cursor-pointer">
          <img src={closeButton} alt="닫기" />
        </button>
        <div className="flex flex-col items-start">
          <div className="w-[450px] h-[60px] my-[35px] mx-[32px] bg-white rounded-full border border-gray-200 shadow-md flex items-center px-[34px]">
            <img 
              src={searchIcon} 
              alt="search"
              className="w-[8%] h-[45%] mr-5"
             />
            <input
              type="text"
              placeholder="검색창"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyPress}
              className="w-full h-6 border-none outline-none text-md text-textPrimary font-sans"
            />
            {searchTerm && (
              <button
                className="ml-auto inline-flex items-center justify-center bg-secondary text-white font-sans cursor-pointer rounded-[10px] w-[70px] h-[30px] px-2"
                onClick={handleSearchCancel}
              >
                삭제
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 my-5 pb-3 mx-10 border-b">
          {Object.keys(tabMapping).map((tab, index) => (
            <div key={tab} className="flex items-center">
              <button
                className={`px-4 py-2 text-lg font-sans ${
                  activeTab === tab ? "font-bold text-textBlack" : "text-textGray"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tabMapping[tab]}
              </button>
              {index < Object.keys(tabMapping).length - 1 && (
                <div className="text-textGray ml-4">|</div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center gap-1 h-[300px] overflow-y-auto font-sans">
          {renderSearchResults()}
        </div>
      </div>
    </div>
  );
};

export default WebSearchPage;
