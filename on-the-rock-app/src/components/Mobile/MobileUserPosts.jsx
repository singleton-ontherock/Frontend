import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserFeed } from "../../store/contentsSlice";
import character from "../../assets/character.png";

const Feed = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userFeed = useSelector((state) => state.contents.userFeed);
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 6;

	useEffect(() => {
		if (id) {
			dispatch(getUserFeed(id));
		}
	}, [dispatch, id]);

	const totalPages = Math.ceil(userFeed?.length / postsPerPage);

	const currentPosts = () => {
		const startIndex = (currentPage - 1) * postsPerPage;
		return userFeed?.slice(startIndex, startIndex + postsPerPage) || [];
	};

	const handlePageChange = (direction) => {
		setCurrentPage((prevPage) => {
			if (direction === "next" && prevPage < totalPages) {
				return prevPage + 1;
			} else if (direction === "prev" && prevPage > 1) {
				return prevPage - 1;
			}
			return prevPage;
		});
	};

	const handlePostClick = (postId, author) => {
		navigate(`/detail/${postId}`, {
			state: {
				author: {
					...author,
					profileImageUrl: author?.profilePicture || character,
				},
			},
		});
	};

	const renderPosts = () => {
		const posts = currentPosts();
		if (posts.length === 0) {
			return (
				<div className="flex-col justify-center items-center= mt-[5vh]">
					<img src={character} alt="캐릭터" className="w-16 mb-3" />
					<span className="text-md font-bold text-textBlack mr-3">피드 없음</span>
				</div>
			);
		}
		return (
			<div className="grid grid-cols-2 gap-4 w-full">
				{posts.map((post) => (
					<div
						key={post.postId}
						className="bg-white shadow-md rounded-lg flex flex-col aspect-square cursor-pointer overflow-hidden"
						onClick={() => handlePostClick(post.postId, post.author)}
					>
						<div className="relative flex-grow">
							{post.mediaList?.length > 0 && (
								<>
									{post.mediaList[0].mediaType === "IMAGE" ? (
										<img
											className="absolute inset-0 w-full h-full object-cover"
											src={post.mediaList[0].mediaUrl}
											alt={`Post ${post.postId}`}
										/>
									) : (
										<video
											className="absolute inset-0 w-full h-full object-cover"
											src={post.mediaList[0].mediaUrl}
											autoPlay
											muted
											loop
										/>
									)}
								</>
							)}
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="flex flex-col items-center gap-4 w-full max-w-6xl mx-auto px-4">
			{renderPosts()}
			{userFeed?.length > 0 && (
				<div className="flex justify-center gap-10 w-full max-w-xl mt-4">
					<button
						onClick={() => handlePageChange("prev")}
						disabled={currentPage === 1}
						className="px-4 py-2 bg-secondary bg-opacity-50 rounded-lg text-white disabled:bg-secondary"
					>
						이전 페이지
					</button>
					<button
						onClick={() => handlePageChange("next")}
						disabled={currentPage === totalPages}
						className="px-4 py-2 bg-secondary bg-opacity-60 rounded-lg text-white disabled:bg-secondary"
					>
						다음 페이지
					</button>
				</div>
			)}
		</div>
	);
};

export default Feed;
