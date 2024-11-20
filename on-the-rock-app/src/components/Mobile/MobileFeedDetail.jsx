import MobileFeedDetailComment from "./MobileFeedDetailComment";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { toggleLoginPopUp } from "../../store/store";
import leftIcon from "../../assets/left.svg";
import rightIcon from "../../assets/right.svg";
import defaultProfileImg from "../../assets/default_profile.png"; // 기본 프로필 이미지
import commentIcon from "../../assets/comment_white.svg";
import alertIcon from "../../assets/alert.svg";
import heartIcon from "../../assets/heart_notfilled.svg";
import heartFilled from "../../assets/heart_filled.svg";
import {
    getPostDetails,
    likePost,
    dislikePost,
    getLikesCount,
    isLikedPost,
    postReport, // postReport 액션 추가
} from "../../store/contentsSlice";
import { getUserProfile } from '../../store/userSlice';

const MobileFeedDetail = () => {
    const dispatch = useDispatch();
    const [isCommentVisible, setCommentVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { postId } = useParams();
    const { postDetails, liked, likesCount } = useSelector((state) => state.contents);
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const imageContainerRef = useRef(null);
    const [like, setLike] = useState(0);
    const [myLike, setMyLike] = useState(false);

    // location에서 author 정보를 가져옵니다.
    const { author } = location.state || {};
    const profile = user.userProfile;

    useEffect(() => {
        console.log('auth', author);
        if (postId && author) {
            dispatch(getPostDetails(postId));
            dispatch(getLikesCount(postId));
            dispatch(isLikedPost({ postId, userId: author.id }))
                .unwrap()
                .then((result) => {
                    setMyLike(result);
                });
            dispatch(getUserProfile(author.id))
                .unwrap()
                .then((profile) => {
                    // Assuming authorProfile is updated in the store
                    console.log("Author Profile:", profile);
                })
                .catch((error) => {
                    console.error("Failed to fetch author profile:", error);
                });
                console
        } else {
            navigate("/");
        }
    }, [dispatch, postId, navigate, author]);

    useEffect(() => {
        setLike(likesCount);
    }, [likesCount]);

    useEffect(() => {
        if (!user.isLoggedIn) {
            navigate("/");
        }
    }, [user.isLoggedIn, navigate]);

    const handleNavigation = (path, requireLogin = true) => {
        if (requireLogin && !user.isLoggedIn) {
            window.alert("잘못된 접근입니다.");
            dispatch(toggleLoginPopUp());
        } else {
            navigate(path);
        }
    };

    // 프로필 사진 클릭 시 마이페이지로 이동하도록 수정
    const navigateToUserPage = () => {
        if (author && author.id) {
            handleNavigation(`/userPage/${author.id}`, true); // 유저 페이지로 이동 시 author.id를 URL에 포함
        }
    };

    const renderMedia = (mediaList) => {
        console.log(mediaList);
        if (!Array.isArray(mediaList) || mediaList.length === 0) return null;

        return mediaList.map((media, i) => {
            console.log(`Media Type: ${media.type}`);
            if (media.mediaType === "IMAGE") {
                return (
                    <img
                        className="w-full h-full object-cover snap-center"
                        src={media.mediaUrl}
                        alt={`media-${i}`}
                        key={media.mediaId || i}
                    />
                );
            } else {
                return (
                    <video
                        className="w-full h-full object-cover snap-center"
                        src={media.mediaUrl}
                        alt={`media-${i}`}
                        key={media.mediaId || i}
                        controls
                        muted
                        autoPlay
                        loop
                        type="video/mp4"
                    />
                );
            }
        });
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

    // 댓글 창의 가시성을 토글하는 함수
    const toggleCommentVisibility = () => {
        setCommentVisible(!isCommentVisible);
    };

    // 댓글 창을 외부에서 토글하는 함수
    const toggleCommentVisibilityOuter = () => {
        if (isCommentVisible) {
            setCommentVisible(!isCommentVisible);
        }
    };

    const leftLast = () => {
        return currentImageIndex === 0;
    };

    const rightLast = () => {
        return currentImageIndex === (postDetails.mediaList?.length || 0) - 1;
    };

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

    // 신고 처리 핸들러
    const handleReport = () => {
        dispatch(postReport({ postId, reporterId: user.userProfile.id }))
            .unwrap()
            .then(() => {
                window.alert("신고가 완료되었습니다.");
                navigate("/"); // 메인 페이지로 이동
            })
            .catch((error) => {
                window.alert("신고에 실패했습니다. 다시 시도해주세요.");
                console.error("Failed to report post:", error);
            });
    };

    if (!user.isLoggedIn) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen rounded-md overflow-hidden">
            <div
                {...swipeHandlers}
                className="relative flex-1 overflow-hidden mt-[19vh] mb-[10vh] mx-[3vh] rounded-md"
                onClick={toggleCommentVisibilityOuter}
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
                    className="w-full h-full flex overflow-x-hidden snap-x snap-mandatory scroll-smooth rounded-md"
                    ref={imageContainerRef}
                >
                    {postDetails?.mediaList ? renderMedia(postDetails.mediaList) : null}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 flex justify-between items-end z-10 rounded-b-md">
                    <div>
                        <div className="flex items-center mb-3 pb-3">
                            <div className="w-12 h-12 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden cursor-pointer mr-[3vw]">
                                <img
                                    className="w-full h-full object-cover"
                                    src={profile?.profilePicture || defaultProfileImg} // 프로필 사진 URL 사용
                                    alt="Profile"
                                    onClick={navigateToUserPage}
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-md font-bold">
                                    {profile?.nickname || "포스팅하는 사람 이름"}
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-white mb-3">
                            {postDetails?.content || "내용이 없습니다"}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <button
                            className="text-sm cursor-pointer bg-accent bg-opacity-20 text-accent py-[3px] px-[5px] rounded flex items-center mb-10"
                            onClick={handleReport} // 신고 처리 핸들러 연결
                        >
                            <img src={alertIcon} alt="alert" className="w-[18px] mr-1" />
                            신고
                        </button>
                        <div className="flex items-center space-x-3 mr-[2px]">
                            <div className="flex flex-col items-center">
                                <div className="w-[20px] cursor-pointer mb-1" onClick={changeLike}>
                                    <img src={myLike ? heartFilled : heartIcon} />
                                </div>
                                <span className="text-xs text-white">{like || 0}</span> {/* 수정된 부분 */}
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
            <div className={`z-0 ${isCommentVisible ? "z-10" : ""} rounded-b-lg`}>
                <MobileFeedDetailComment
                    isVisible={isCommentVisible}
                    toggleVisibility={toggleCommentVisibility}
                    postId={postId} // postId를 prop으로 전달합니다.
                    userId={author.id} // userId를 전달합니다.
                />
            </div>
        </div>
    );
};

export default MobileFeedDetail;
