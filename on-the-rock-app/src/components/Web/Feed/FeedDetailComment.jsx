import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComments, postComment } from "../../../store/contentsSlice";
import { getUserProfile } from "../../../store/userSlice";

const FeedDetailComment = ({ isVisible, toggleVisibility, postId }) => {
	const [commentText, setCommentText] = useState(""); // 댓글 입력 필드의 상태
	const dispatch = useDispatch();
	const comments = useSelector((state) => state.contents.comments); // 댓글 상태 선택
	const [commentUsers, setCommentUsers] = useState([]); // 댓글 사용자 정보 상태
	const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시간을 상태로 저장

	// postId가 변경될 때마다 댓글을 가져오고, 각 댓글의 작성자 정보를 가져옴
	useEffect(() => {
		if (postId) {
			dispatch(getComments(postId)).then((response) => {
				const userIds = response.payload.map((comment) => comment.userId);
				Promise.all(userIds.map((id) => dispatch(getUserProfile(id)).unwrap()))
					.then((users) => {
						setCommentUsers(users);
					})
					.catch((error) =>
						console.error("Failed to fetch user profiles", error)
					);
			});
			setCurrentTime(new Date()); // 댓글을 가져올 때마다 현재 시간 업데이트
		}
	}, [dispatch, postId]);

	// 댓글을 추가하는 함수
	const handleAddComment = () => {
		if (commentText.trim()) {
			dispatch(postComment({ postId, commentData: commentText }))
				.unwrap()
				.then(() => {
					setCommentText("");
					dispatch(getComments(postId)).then((response) => {
						const userIds = response.payload.map((comment) => comment.userId);
						Promise.all(
							userIds.map((id) => dispatch(getUserProfile(id)).unwrap())
						)
							.then((users) => {
								setCommentUsers(users);
							})
							.catch((error) =>
								console.error("Failed to fetch user profiles", error)
							);
					});
					setCurrentTime(new Date()); // 댓글 추가 후에도 현재 시간 업데이트
				});
		}
	};

	// 작성된 시간과 현재 시간의 차이를 계산하는 함수
	const timeAgo = (createdAt) => {
		const commentTime = new Date(createdAt);
		const timeDiff = Math.floor((currentTime - commentTime) / 1000); // 초 단위 차이 계산

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

	// 댓글의 내용을 올바르게 파싱하여 렌더링하는 함수
	const parseCommentContent = (content) => {
		try {
			const parsedContent = JSON.parse(content);
			return parsedContent.commentData || content;
		} catch (error) {
			// JSON 파싱이 실패하면 원래 content를 그대로 반환
			return content;
		}
	};

	return (
		<div
			className={`fixed left-1/2 transform -translate-x-1/2 w-[50%] max-w-[900px] h-[50%] bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
				isVisible ? "bottom-0" : "-bottom-full"
			} rounded-t-lg`}
		>
			<div
				className="w-12 h-1 bg-gray-400 rounded-full my-2 mx-auto cursor-pointer"
				onClick={toggleVisibility}
			></div>
			<div className="flex-1 overflow-y-auto p-4">
				<div className="flex mb-4">
					<input
						type="text"
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						placeholder="댓글을 작성하세요"
						className="flex-grow p-2 bg-white border-2 border-secondary rounded-md focus:outline-none"
					/>
					<button
						onClick={handleAddComment}
						className="ml-2 px-4 py-2 bg-secondary text-white rounded-md"
					>
						보내기
					</button>
				</div>
				{Array.isArray(comments) && comments.length > 0 ? (
					comments.map((comment, index) => {
						const user = commentUsers.find((u) => u.id === comment.userId);
						return (
							<div
								key={index}
								className="flex items-start my-2 ml-3 border-b border-gray-200 pb-2"
							>
								<div className="flex-1">
									<p className="font-bold">
										{user ? user.nickname : "Unknown User"}
									</p>
									<p className="text-sm">
										{parseCommentContent(comment.content)}
									</p>
									<span className="text-xs text-gray-500">
										{timeAgo(comment.createdAt)}
									</span>
								</div>
							</div>
						);
					})
				) : (
					<p className="ml-3 mt-6">댓글이 없습니다.</p>
				)}
			</div>
		</div>
	);
};

FeedDetailComment.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	toggleVisibility: PropTypes.func.isRequired,
	postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default FeedDetailComment;