import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getUserFeed } from '../../../store/contentsSlice';

const Feed = ({ userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // useNavigate 훅 추가
  const feedData = useSelector((state) => state.contents.userFeed || []);

  useEffect(() => {
    console.log("useEffect triggered");
    console.log("userId:", userId);

    if (userId) {
      console.log("Dispatching getUserFeed with userId:", userId);
      dispatch(getUserFeed(userId))
        .unwrap()
        .then((data) => {
          console.log("Fetched feed data:", data);
        })
        .catch((error) => {
          console.error("Error fetching feed data:", error);
        });
    }
  }, [dispatch, userId]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const totalPages = Math.ceil(feedData.length / postsPerPage);
  const currentPosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return feedData.slice(startIndex, startIndex + postsPerPage);
  };

  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => {
      if (direction === 'next' && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === 'prev' && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const handlePostClick = (postId) => {
    navigate(`/feedDetail/${postId}`, { state: { postId } });
  };

  const renderPosts = () => {
    const posts = currentPosts();
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full font-sans">
        {posts.map((post) => (
          <div
            key={post.postId}
            className="shadow-md rounded-lg flex flex-col aspect-square cursor-pointer overflow-hidden"
            onClick={() => handlePostClick(post.postId)}  // 클릭 시 handlePostClick 호출
          >
            <div className="relative flex-grow">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src={post.mediaList[0]?.mediaUrl}
                alt={post.title}
              />
            </div>
            <div className="px-3 pb-3">
              {post.hashtags.map((hashtag) => (
                <span key={hashtag.keywordId} className="text-xs text-secondary mr-2">
                  #{hashtag.keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-6xl mx-auto px-4">
      {renderPosts()}
      <div className="flex justify-center gap-10 w-full max-w-xl mt-4">
        <button 
          onClick={() => handlePageChange('prev')} 
          disabled={currentPage === 1}
          className="px-4 py-2 bg-secondary bg-opacity-50 rounded-lg text-white disabled:bg-secondary"
        >
          이전 페이지
        </button>
        <button 
          onClick={() => handlePageChange('next')} 
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-secondary bg-opacity-60 rounded-lg text-white disabled:bg-secondary"
        >
          다음 페이지
        </button>
      </div>
    </div>
  );
};

export default Feed;
