import { forwardRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import likeIcon from "../../assets/like.svg";

const PostCard = memo(
  forwardRef(({ data }, ref) => {
    const navigate = useNavigate();
    const post = data?.post || {};
    const mediaList = post?.mediaList || [];
    const likeCount = data?.likeCount || 0;
    const author = { id: post.userId }; // author 정보를 post에서 추출

    const handleClick = () => {
      if (data) {
        console.log('author',author);
        navigate(`/detail/${post.postId}`, {
          state: {
            post: post,
            author: author,
            likeCount: likeCount,
          },
        });
      }
    };

    const handleProfileClick = (e) => {
      e.stopPropagation();
      if (author?.id) {
        navigate(`/userPage/${author.id}`);
      }
    };

    const likesView = () => {
      if (likeCount < 1000) {
        return `${likeCount}`;
      }
      let result = Math.floor(likeCount / 1000) + ".";
      result += Math.floor((likeCount % 1000) / 100) + "k";
      return result + " Likes";
    };

    if (!data) {
      return null;
    }

    return (
      <div
        className="w-full shadow-md flex flex-col aspect-[4/5] cursor-pointer"
        onClick={handleClick}
        ref={ref}
      >
        <div className="relative w-full h-[82%]">
          <div className="absolute inset-0 bg-gray-300"></div>
          {mediaList.length > 0 && (
            <>
              {mediaList[0].mediaType === "IMAGE" ? (
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  src={mediaList[0].mediaUrl}
                  alt="Post Image"
                />
              ) : (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                >
                  <source src={mediaList[0].mediaUrl} type="video/mp4" />
                </video>
              )}
            </>
          )}
        </div>

        <div className="flex justify-start pt-2 ps-2 text-xs">
          <div className="flex gap-2">
            <div className="w-[20px] ps-[2px] pt-[2px]">
              <img src={likeIcon} alt="Like" />
            </div>
            <div className="w-[1px]">
              <div className="text-black text-sm">{likesView()}</div>
            </div>
          </div>
        </div>

        <div className="p-2">
          {post?.title && (
            <h3 className="font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap">
              {post.title}
            </h3>
          )}
          {post?.content && (
            <p className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {post.content}
            </p>
          )}
        </div>

        {/* 프로필 이미지 (추가된 부분) */}
        {author?.profilePicture && (
          <div
            className="w-[30px] h-[30px] rounded-full overflow-hidden mt-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <img
              src={author.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    );
  })
);

PostCard.displayName = "PostCard";

export default PostCard;
