import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Redux 관련 훅 import
import axios from "axios";
import searchIcon from "../../assets/search.svg";
import api from '../../api/index';
import { getContents } from "../../store/contentsSlice"; // getContents import
import PostCard from "./MobilePostCard"; // PostCard 컴포넌트 import

const MobileSearchPage = () => {
  const [activeTab, setActiveTab] = useState("계정");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({
    계정: [],
    태그: [],
    장소: [],
  });
  const dispatch = useDispatch(); // dispatch 함수
  const contents = useSelector((state) => state.contents.contents); // getContents에서 들고온 데이터
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "태그") {
      dispatch(getContents()); // 태그를 클릭할 때 getContents 호출
    }
  }, [dispatch, activeTab]);

	const goToOtherInfo = (item) => {
		if (activeTab === "장소") {
			window.location.href = `https://map.naver.com/p/entry/place/${item.placeId}`; // placeId로 리다이렉트
		} else {
			navigate(`/userpage/${item.id}`);
		}
	};

  const fetchSearchResults = useCallback(async () => {
    if (searchTerm.trim() !== "") {
      try {
        let response;
        switch (activeTab) {
          case "계정":
            response = await api.post(`/user/search`, {
              keyword: searchTerm,
            });
            setSearchResults((prevResults) => ({
              ...prevResults,
              계정: response.data,
            }));
            break;
          case "태그":
            // 태그 검색 시 MobileSearchList로 이동
            navigate("/searchList", { state: { keyword: searchTerm } });
            return; // 여기서 함수 실행을 중단
            case "장소":
              response = await axios.get(`api/contents/gym/search`, {
                params: { gym: searchTerm },
              });
              setSearchResults((prevResults) => ({
                ...prevResults,
                장소: response.data,
              }));
              break;
            default:
              break;
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          alert("검색에 실패했습니다. 다시 시도해 주세요.");
        }
      }
    }, [searchTerm, activeTab, navigate]);

    const handleTabClick = (tab) => {
      setActiveTab(tab);
      if (tab === "계정" && searchTerm.trim() !== "") {
        fetchSearchResults();
      }
    };
  
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
  
    const handleSearchCancel = () => {
      setSearchTerm("");
      setSearchResults({ 계정: [], 태그: [], 장소: [] });
    };
  
    const handleSearchKeyPress = (e) => {
      if (e.key === "Enter") {
        fetchSearchResults();
      }
    };
  
    const renderSearchResults = () => {
      const results = Array.isArray(searchResults[activeTab]) ? searchResults[activeTab] : [];
  
      return results.map((item, index) => (
        <div
          key={index}
          className="w-4/5 bg-white shadow-md border border-gray-200 rounded-lg py-2 px-4 mb-4 text-center text-gray-600"
          onClick={() => goToOtherInfo(item)}
        >
          <div>{activeTab === "계정" ? item.nickname : item.name}</div> {/* 계정일 때는 nickname, 그 외에는 name을 표시 */}
          {activeTab === "장소" && (
            <div className="text-sm text-textBlack">{item.address}</div>
          )}
        </div>
      ));
    };
  
    const renderPostCards = () => {
      if (activeTab === "태그" && contents.length > 0) {
        return contents.map((content, index) => (
          <div
            key={index}
            className="mb-4 w-full" // PostCard를 전체 너비로 설정
          >
            <PostCard data={content} />
          </div>
        ));
      }
      return null;
    };
  
    return (
      <div className="w-full h-full p-2 box-border relative font-sans flex flex-col top-[16vh]">
        <div className="flex items-center justify-between py-2 px-2">
          <div className="flex items-center justify-between border-[2px] border-secondary rounded-[2vh] p-3 mb-5 flex-grow">
            <img 
              src={searchIcon} 
              alt="search"
              className="w-[8%] mr-5"
            />
            <input
              className="bg-white flex-grow outline-none text-md font-sans"
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
            />
            {searchTerm && (
              <button
                className="ml-auto inline-flex items-center justify-center bg-secondary text-white font-sans cursor-pointer rounded-lg w-[55px] h-[30px] px-2"
                onClick={handleSearchCancel}
              >
                삭제
              </button>
            )}
          </div>
        </div>
  
        <div className="flex justify-center gap-8 my-2">
          {["계정", "태그", "장소"].map((tab, index) => (
            <div key={tab} className="flex items-center">
              <button
                className={`text-lg font-bold ${activeTab === tab ? "text-textBlack" : "text-textGray"} focus:outline-none`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
              {index < 2 && (
                <span className="ml-8 text-textGray">|</span>
              )}
            </div>
          ))}
        </div>
  
        <div className="flex flex-col items-center flex-grow overflow-y-auto cursor-pointer p-2 mb-[3vh] mt-3">
          {renderSearchResults()}
        </div>
  
        <div className="flex flex-col justify-center items-center px-[5vh]">
          {renderPostCards()}
        </div>
      </div>
    );
  };
  
  export default MobileSearchPage;