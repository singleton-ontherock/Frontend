import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import searchIcon from "../../assets/search.svg";
import PostCard from "./MobilePostCard";
import { useDispatch } from "react-redux";
import { getAuthor, getLikesCount } from "../../store/contentsSlice.js"
import api from "../../api/index.js";

const MobileSearchList = () => {
	const location = useLocation();
	const [searchTerm, setSearchTerm] = useState(location.state?.keyword || "");
	const [posts, setPosts] = useState([]);
	const [searchHistory, setSearchHistory] = useState([]);
	const dispatch = useDispatch();

	const [likeCounts, setLikeCounts] = useState([]);
	const [authors, setAuthors] = useState([]);

	const postCardRef = useRef(null);

	// 초기 검색어가 있을 때 검색을 수행하지만, 검색 기록에 중복되지 않도록 합니다.
	useEffect(() => {
		if (location.state?.keyword) {
			searchPosts(location.state.keyword, false);
		}
	}, [location.state]);

	useEffect(() => {
		const storedHistory = localStorage.getItem("searchHistory");
		if (storedHistory) {
			setSearchHistory(JSON.parse(storedHistory));
		}
	}, []);

	useEffect(() => {
		if (searchHistory.length > 0) {
			localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
		}
	}, [searchHistory]);

	useEffect(() => {
		if (posts.length > 0) {
			const fetchAuthorsAndLikes = async () => {
				const authorPromises = posts.map(async (clip) => {
					const action = await dispatch(getAuthor(clip.userId));
					return { postId: clip.postId, authorData: action.payload };
				});

				const likePromises = posts.map(async (clip) => {
					const action = await dispatch(getLikesCount(clip.postId));
					return { postId: clip.postId, likesData: action.payload };
				});

				const authorResults = await Promise.all(authorPromises);
				const likeResults = await Promise.all(likePromises);

				const newHotClips = posts.map((clip) => {
					const authorResult = authorResults.find(
						(result) => result.postId === clip.postId
					);
					const likeResult = likeResults.find(
						(result) => result.postId === clip.postId
					);

					return {
						...clip,
						author: authorResult ? authorResult.authorData : null,
						likeCount: likeResult ? likeResult.likesData : 0,
					};
				});

				setAuthors(
					newHotClips.reduce((acc, clip) => {
						if (clip.author) {
							acc[clip.postId] = clip.author;
						}
						return acc;
					}, {})
				);

				setLikeCounts(
					newHotClips.reduce((acc, clip) => {
						acc[clip.postId] = clip.likeCount;
						return acc;
					}, {})
				);
			};
			fetchAuthorsAndLikes();
		}
	}, [posts, dispatch]);

	const addToSearchHistory = async (term) => {
		if (term && !searchHistory.includes(term)) {
			setSearchHistory((prevHistory) => [term, ...prevHistory]);
		}
	};

	const searchPosts = async (keyword, shouldAddToHistory = true) => {
		console.log('키워드', keyword);
		try {
			const response = await api.get(`contents/search?keyword=${keyword}`);
			console.log('리턴', response.data);

			if (response.data.length === 0) {
				alert("해당 데이터가 없습니다.");
			} else {
				setPosts(response.data);
			}

			if (shouldAddToHistory && !searchHistory.includes(keyword)) {
				addToSearchHistory(keyword); // 검색어를 검색 기록에 추가
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
			alert("데이터를 불러오는 데 실패했습니다.");
		}
	};

	const removeSearchTerm = (termToRemove) => {
		setSearchHistory((prevHistory) =>
			prevHistory.filter((term) => term !== termToRemove)
		);
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (searchTerm && !searchHistory.includes(searchTerm)) {
				setSearchHistory((prevHistory) => [searchTerm, ...prevHistory]);
			}
			searchPosts(searchTerm, false);
		}
	};

	const renderSearchHistory = () => {
		return (
			searchHistory.length > 0 && (
				<div className="p-4 mt-3 bg-white border-b border-gray-300 font-sans">
					<div className="flex flex-wrap items-center">
						<h4 className="text-sm font-semibold text-textBlack mr-2 mb-2">
							검색 기록:
						</h4>
						{searchHistory.map((term, index) => (
							<span
								key={index}
								className="bg-secondary text-white px-[1vw] py-[0.5vh] rounded-[1vh] text-sm flex items-center mr-2 mb-2"
							>
								{`# ${term}`}
								<button
									className="bg-none border-none text-white ml-1 text-xs cursor-pointer"
									onClick={() => removeSearchTerm(term)}
								>
									x
								</button>
							</span>
						))}
					</div>
				</div>
			)
		);
	};

	const renderPostCards = useCallback(() => {
		return posts.map((post, index) => (
			<motion.div
				key={post.postId}
				className="w-full mb-4" // 한 줄에 하나의 포스트 카드를 띄우도록 수정
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{console.log('log', post)}
				<PostCard
					key={post.postId || `post-${index}`}
					data={{
						post: {
							postId: post.postId,
							userId: post.userId,
							gymId: post.gymId,
							title: post.title,
							content: post.content,
							visibility: post.visibility,
							success: post.success,
							createdAt: post.createdAt,
							mediaList: post.mediaList,
							hashtags: post.hashtags,
						},
						likeCount: likeCounts[post.postId] || 0,
					}}
					ref={index === 0 ? postCardRef : null}
				/>
			</motion.div>
		));
	}, [posts, likeCounts, authors]);


	return (
		<div className="w-full bg-white font-sans mt-[10vh] pt-14 pb-14 box-border font-sans">
			<div className="max-w-md mx-auto">
				<div className="sticky top-[9%] z-50 p-4">
					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex items-center border-[2px] border-secondary rounded-[2vh] p-3"
					>
						<img src={searchIcon} alt="search" className="w-[8%] mr-5" />
						<input
							type="text"
							placeholder="검색어를 입력하세요"
							value={searchTerm}
							onChange={handleInputChange}
							onKeyDown={handleKeyPress}
							className="bg-transparent border-none text-md text-gray-800 w-full focus:outline-none"
						/>
						{searchTerm && (
							<button
								type="button"
								className="ml-auto inline-flex items-center justify-center bg-secondary text-white font-sans cursor-pointer rounded-lg w-[60px] h-[30px] px-2"
								onClick={() => setSearchTerm("")}
							>
								삭제
							</button>
						)}
					</form>
				</div>
				{renderSearchHistory()}
				<motion.div
					className="flex flex-col items-center gap-4 my-[10%] mx-10"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					{renderPostCards()}
				</motion.div>
			</div>
		</div>
	);
};

export default MobileSearchList;
