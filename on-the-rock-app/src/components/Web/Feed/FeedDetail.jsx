import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSwipeable } from "react-swipeable";
import {
  getPostDetails,
  likePost,
  dislikePost,
  getLikesCount,
  isLikedPost,
  getAuthor,
	getFeed
} from "../../../store/contentsSlice";
import { toggleLoginPopUp } from "../../../store/store";
import FeedDetailComment from "./FeedDetailComment";
import leftIcon from "../../../assets/left.svg";
import rightIcon from "../../../assets/right.svg";
import profileImg from "../../../assets/default_profile.png";
import commentIcon from "../../../assets/comment_white.svg";
import alertIcon from "../../../assets/alert.svg";
import heartIcon from "../../../assets/heart_notfilled.svg";
import heartFilled from "../../../assets/heart_filled.svg";

const FeedDetail = () => {
  const dispatch = useDispatch();
  const { postId } = useParams();
  const { postDetails, likesCount, error, author } = useSelector((state) => state.contents);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const imageContainerRef = useRef(null);

  const [isCommentVisible, setCommentVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [like, setLike] = useState(0);
  const [myLike, setMyLike] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(getPostDetails(postId))
        .unwrap()
        .then((postDetails) => {
          if (postDetails.userId) {
            dispatch(getAuthor(postDetails.userId));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch post details:", err);
        });

      dispatch(getLikesCount(postId));
    } else {
      navigate("/"); // Redirect if no postId is provided
    }
  }, [dispatch, postId, navigate]);

  useEffect(() => {
    if (author?.id) {
      dispatch(isLikedPost({ postId, userId: author.id }))
        .unwrap()
        .then((result) => {
          setMyLike(result);
        });
    }
  }, [dispatch, postId, author?.id]);

  useEffect(() => {
    setLike(likesCount);
  }, [likesCount]);

  const handleNavigation = (path, requireLogin = true) => {
    if (requireLogin && !user.isLoggedIn) {
      window.alert("잘못된 접근입니다.");
      dispatch(toggleLoginPopUp());
    } else {
      navigate(path);
    }
  };

  const renderImage = (mediaList) => {
    if (!Array.isArray(mediaList) || mediaList.length === 0) return null;

    return mediaList.map((media, i) => (
      <img
        className="w-full h-full object-cover snap-center"
        src={media.mediaUrl}
        alt={`media-${i}`}
        key={media.mediaId || i}
      />
    ));
  };

  const changeLike = () => {
    if (myLike) {
      dispatch(dislikePost({ postId, userId: author.id }))
        .unwrap()
        .then(() => {
          setLike((prevLike) => prevLike - 1);
          setMyLike(false);
        });
    } else {
      dispatch(likePost({ postId, userId: author.id }))
        .unwrap()
        .then(() => {
          setLike((prevLike) => prevLike + 1);
          setMyLike(true);
        });
    }
  };

  const toggleCommentVisibility = () => {
    setCommentVisible(!isCommentVisible);
  };

  const leftLast = () => currentImageIndex === 0;
  const rightLast = () => currentImageIndex === (postDetails.mediaList?.length || 0) - 1;

  const handleRightScroll = () => {
    if (!rightLast()) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
      imageContainerRef.current.scrollLeft += imageContainerRef.current.offsetWidth;
    }
  };

  const handleLeftScroll = () => {
    if (!leftLast()) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
      imageContainerRef.current.scrollLeft -= imageContainerRef.current.offsetWidth;
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleRightScroll,
    onSwipedRight: handleLeftScroll,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (!user.isLoggedIn) {
    return null;
  }

  if (error) {
    return <div>Error fetching post details: {error}</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative flex flex-col w-[50%] max-w-[900px] h-[80%] top-10 bg-white rounded-lg overflow-hidden shadow-lg">
        <div
          {...swipeHandlers}
          className="relative flex-1 overflow-hidden rounded-t-lg"
        >
          <div className="absolute top-[3vh] right-[2vh] bg-black bg-opacity-50 text-white px-2 py-1 rounded-full z-10">
            {currentImageIndex + 1}/{postDetails.mediaList?.length || 0}
          </div>
          {!leftLast() && (
            <div
              className="absolute top-1/2 left-5 transform -translate-y-1/2 z-0 cursor-pointer"
              onClick={handleLeftScroll}
            >
              <img
                src={leftIcon}
                alt="Left"
                className="w-10 h-12 opacity-70 rounded-full"
              />
            </div>
          )}
          {!rightLast() && (
            <div
              className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10 cursor-pointer"
              onClick={handleRightScroll}
            >
              <img
                src={rightIcon}
                alt="Right"
                className="w-10 h-12 opacity-70 rounded-full"
              />
            </div>
          )}
          <div
            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
            ref={imageContainerRef}
          >
						{console.log(postDetails)}
            {postDetails?.mediaList ? renderImage(postDetails.mediaList) : null}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 flex justify-between items-end z-10 rounded-b-lg">
            <div>
              <div className="flex items-center mb-3 pb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden cursor-pointer mr-[2vw]">
                  <img
                    className="w-full h-full object-cover"
                    src={author?.profilePicture || profileImg}
                    alt="Profile"
                    onClick={() => handleNavigation(`/userPage/${author?.id}`)}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-md font-bold">
                    {author?.nickname || "포스팅하는 사람 이름"}
                  </div>
                </div>
              </div>
              <div className="text-sm text-white mb-3">
                {postDetails?.content || "내용이 없습니다"}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <button className="text-sm cursor-pointer bg-black bg-opacity-30 text-accent py-[3px] px-[5px] rounded flex items-center mb-10">
                <img src={alertIcon} alt="alert" className="w-[18px] mr-1" />
                신고
              </button>
              <div className="flex items-center space-x-3 mr-[2px]">
                <div className="flex flex-col items-center">
                  <div className="w-[20px] cursor-pointer mb-1" onClick={changeLike}>
                    <img src={myLike ? heartFilled : heartIcon} />
                  </div>
                  <span className="text-xs text-white">{likesCount}</span>
                </div>
                <div
                  className="w-[19px] mb-5 cursor-pointer"
                  onClick={toggleCommentVisibility}
                >
                  <img src={commentIcon} alt="comment" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {isCommentVisible && (
          <div className="absolute bottom-0 left-0 right-0 rounded-t-lg overflow-y-auto max-h-1/3 z-20">
            <FeedDetailComment
              isVisible={isCommentVisible}
              toggleVisibility={toggleCommentVisibility}
              postId={postId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedDetail;
