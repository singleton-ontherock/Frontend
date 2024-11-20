import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLoginPopUp } from '../../../store/store';
import likeIcon from '../../../assets/like.svg';

function FlipCard({ onClick, likes, thumbnail }) {
  return (
    <div className="group w-[260px] h-[300px] [perspective:1100px]">
      <div className="relative w-full h-full duration-500 shadow-lg [transform-style:preserve-3d] group-hover:rotate-y-180">
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <img
            src={thumbnail}
            alt="clip"
            className="w-full h-full object-cover filter cursor-pointer"
            onClick={onClick}
          />
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] rotate-y-180">
          <div className="w-full h-full flex flex-col justify-between items-center bg-white rounded-md shadow-md">
            <img
              src={thumbnail}
              alt="clip"
              className="w-full h-[85%] object-cover cursor-pointer rounded-t-md"
              onClick={onClick}
            />
            {/* 좋아요 수 표시 */}
            <div className="flex justify-center items-center h-[15%] bg-white w-full">
              <img src={likeIcon} alt="Like" className="w-4 h-4 mr-1" />
              <span className="text-sm font-bold">{likes} Likes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HotClips({ clips }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [visibleCount, setVisibleCount] = useState(6);

  const handlePlayButtonClick = (clip) => {
    navigate(`/detail/${clip.post.postId}`, { state: { clip } });
  };

  const handleShowMore = () => {
    if (!user.isLoggedIn) {
      dispatch(toggleLoginPopUp());
    } else {
      setVisibleCount((prevCount) => prevCount + 3);
    }
  };

  return (
    <div className={`flex flex-col px-3 ${user.isLoggedIn ? 'overflow-y-auto' : ''} h-full`}>
      <div className="rounded-lg grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center p-10">
        {clips.slice(0, visibleCount).map((clip, index) => (
          <FlipCard
            key={clip.post.postId}
            onClick={() => handlePlayButtonClick(clip)}
            likes={clip.likeCount}
            thumbnail={clip.post.mediaList[0].mediaUrl}
          />
        ))}
      </div>
      {visibleCount < clips.length && (
        <div className="flex justify-center items-center w-full p-8">
          <button className="text-textBlack" onClick={handleShowMore}>
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}

export default HotClips;
