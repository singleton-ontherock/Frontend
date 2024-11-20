import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../MainPage/SideBar';
import PostCard from '../../Mobile/MobilePostCard';
import searchIcon from '../../../assets/search.svg';

const FeedSearchResult = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const keyword = location.state?.keyword || '';

  // Example data. In a real implementation, this would come from an API or props.
  const posts = [
    { userName: 'User1', likes: 2400, index: 1 },
    { userName: 'User2', likes: 1800, index: 2 },
    { userName: 'User3', likes: 3200, index: 3 },
    // Add more posts...
  ];

  const addToSearchHistory = useCallback((term) => {
    if (term && !searchHistory.includes(term)) {
      setSearchHistory(prevHistory => [term, ...prevHistory]);
    }
  }, [searchHistory]);

  useEffect(() => {
    if (keyword) {
      addToSearchHistory(keyword);
    }
  }, [keyword, addToSearchHistory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      addToSearchHistory(searchTerm);
      setSearchTerm('');
    }
  };

  const removeSearchTerm = (termToRemove) => {
    setSearchHistory(searchHistory.filter(term => term !== termToRemove));
  };

  return (
    <div className="flex w-full min-h-screen bg-white pt-[10vh]">
      <div className="mr-4">
        <SideBar />
      </div>
      <div className="flex-1 overflow-y-auto mx-[10vh] mt-[7vh]">
        <div className="flex justify-center items-center p-4 w-full box-border">
          <form onSubmit={handleSearchSubmit} className="flex bg-white shadow-md border rounded-lg p-4 w-[80%]">
            <img 
              src={searchIcon} 
              alt="search"
              className="w-[24px] h-[24px] mr-5"
            />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-md text-gray-800 w-full focus:outline-none"
            />
            {searchTerm && (
              <button
                className="ml-auto inline-flex items-center justify-center bg-secondary text-primary font-sans cursor-pointer rounded-lg w-[60px] h-[30px] px-2"
                onClick={() => setSearchTerm('')}
              >
                삭제
              </button>
            )}
          </form>
        </div>
        {searchHistory.length > 0 && (
          <div className="mt-4 p-4 bg-white border-b font-sans">
            <div className="flex flex-wrap items-center">
              <h4 className="text-sm font-semibold text-gray-800 mr-2 mb-2">검색 기록:</h4>
              {searchHistory.map((term, index) => (
                <span
                  key={index}
                  className="bg-secondary text-white px-[1vw] py-[0.5vh] rounded-xl text-sm flex items-center mr-2 mb-2"
                >
                  {`# ${term}`}
                  <button
                    className="bg-none border-none text-white ml-2 mb-[1.5px] text-sm cursor-pointer"
                    onClick={() => removeSearchTerm(term)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col items-center gap-6 my-6 mx-auto w-[55%]">
          {posts.map((post, index) => (
            <PostCard
              key={index}
              userName={post.userName}
              likes={post.likes}
              index={post.index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedSearchResult;