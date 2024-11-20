import PropTypes from "prop-types";
import { getComments, postComment } from "../../store/contentsSlice";
import { getUserProfile } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

const MobileFeedDetailComment = ({
	isVisible,
	toggleVisibility,
	userId,
	postId,
}) => {
	const [commentText, setCommentText] = useState("");
	const [loading, setLoading] = useState(false); // 로딩 상태 추가
	const dispatch = useDispatch();
	const comments = useSelector((state) => state.contents.comments);
	const [commentUsers, setCommentUsers] = useState([]);
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		
		if (postId && userId) {
			// postId와 userId가 유효한 경우에만 실행
			setLoading(true); // 로딩 시작
			dispatch(getComments(postId))
				.then((response) => {
					const userIds = response.payload.map((comment) => comment.userId);
					console.log(userIds);
					return Promise.all(
						userIds.map((id) => dispatch(getUserProfile(id)).unwrap())
					);
				})
				.then((users) => {
					setCommentUsers(users);
				})
				.catch((error) => console.error("Failed to fetch user profiles", error))
				.finally(() => {
					setLoading(false); // 로딩 완료
				});

			setCurrentTime(new Date());
		}
	}, [dispatch, postId, userId]);

	const handleAddComment = () => {
		console.log(commentText)
		console.log(postId)
		console.log(userId)

		if (commentText.trim() && postId && userId) {
			// commentText, postId, userId가 유효한 경우에만 실행
			dispatch(postComment({ postId, userId, commentData: commentText }))
				.unwrap()
				.then(() => {
					setCommentText("");
					return dispatch(getComments(postId));
				})
				.then((response) => {
					const userIds = response.payload.map((comment) => comment.userId);
					return Promise.all(
						userIds.map((id) => dispatch(getUserProfile(id)).unwrap())
					);
				})
				.then((users) => {
					setCommentUsers(users);
				})
				.catch((error) => console.error("Failed to fetch user profiles", error))
				.finally(() => {
					setCurrentTime(new Date());
				});
		}
	};

	const timeAgo = (createdAt) => {
		const commentTime = new Date(createdAt);
		const timeDiff = Math.floor((currentTime - commentTime) / 1000); // 밀리초 단위 차이를 초 단위로 변환

		if (timeDiff < 60) {
			return `${timeDiff}초 전`;
		} else if (timeDiff < 3600) {
			return `${Math.floor(timeDiff / 60)}분 전`;
		} else if (timeDiff < 86400) {
			return `${Math.floor(timeDiff / 3600)}시간 전`;
		} else {
			return `${Math.floor(timeDiff / 86400)}일 전`;
		}
	};

	const parseCommentContent = (content) => {
		try {
			const parsedContent = JSON.parse(content);
			return parsedContent.commentData || content;
		} catch (error) {
			return content;
		}
	};

	if (loading) {
		return <div>Loading...</div>; // 로딩 중 표시
	}

	return (
		<div
			className={`fixed left-0 w-full h-1/2 bg-white shadow-md transition-bottom duration-300 ease-in-out flex flex-col ${
				isVisible ? "bottom-0" : "-bottom-full"
			}`}
		>
			<div
				className="w-12 h-1 bg-secondary rounded-full my-2 mx-auto cursor-pointer"
				onClick={toggleVisibility}
			></div>
			<div className="flex-1 overflow-y-auto p-4">
				<div className="flex mb-4">
					<input
						type="text"
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						placeholder="댓글을 작성하세요"
						className="w-3/4 p-2 bg-white border-2 border-secondary rounded-md focus:outline-none focus:border-textGray"
					/>
					<button
						onClick={handleAddComment}
						className="ml-2 px-4 py-2 bg-secondary text-white rounded-md text-sm"
					>
						보내기
					</button>
				</div>
				{Array.isArray(comments) && comments.length > 0 ? (
					comments.map((comment, index) => {
						return (
							<div
								key={index}
								className="flex items-center my-2 mx-3 font-sans"
							>
								<div className="flex-1 border-b pb-1">
									<p className="font-extrabold">
										{commentUsers[index]?.nickname}
									</p>
									<p className="text-sm">
										{parseCommentContent(comment.content)}
									</p>
									<span className="text-xs text-textGray">
										{timeAgo(comment.createdAt)}
									</span>
								</div>
							</div>
						);
					})
				) : (
					<p className="ml-2 mt-2">댓글이 없습니다.</p>
				)}
			</div>
		</div>
	);
};

export default MobileFeedDetailComment;
