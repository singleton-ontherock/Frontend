import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import uploadIcon from "../../assets/upload_icon.svg";
import { postContents,postHashtags,addHashtagsToPost } from "../../store/contentsSlice";
import { useDispatch, useSelector } from "react-redux";
// import { getUserProfile } from "../../store/userSlice";
import lock from "../../assets/lock.svg";
import unlock from "../../assets/unlock.svg";
import UploadResultPopup from "./UploadResultPopUp";
import { getGymSearch } from "../../store/contentsSlice";
import Cookies from "js-cookie";

// const climbingGyms = [
// 	{ id: 1, name: "Mountain Peak Climbing Studio" },
// 	{ id: 2, name: "Rocky Road Climbing Gym" },
// 	{ id: 3, name: "Summit Heights Climbing Center" },
// ];

export const MobileUpload = () => {
	const [hashtags, setHashtags] = useState([]);
	const [inputHashtag, setInputHashtag] = useState("");
	const [showAllTags, setShowAllTags] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [selectedGym, setSelectedGym] = useState(null);
	const userId = Cookies.get("userId");

	// 여긴 더이상 사용 안할 수도
	const [selectedButton, setSelectedButton] = useState("");

	const [isLocked, setIsLocked] = useState(false); // 잠금 상태를 관리하기 위한 state
	const dispatch = useDispatch();
	const [showPopup, setShowPopup] = useState(false); // 팝업 표시 여부 상태
	const [isSuccess, setIsSuccess] = useState(false); // 성공 여부 상태
	const navigate = useNavigate();

	// 여기 코드 사용해보기!!!!!!

	// const filteredGyms = climbingGyms.filter((gym) =>
	// 	gym.name.toLowerCase().includes(searchQuery.toLowerCase())
	// );

	const searchResults = useSelector((state) => state.contents.gymSearchResults);

	const handleSearchInput = (e) => {
		const searchTerm = e.target.value;
		setSearchInput(searchTerm);

		if (e.key === "Enter" && searchTerm.trim() !== "") {
			dispatch(getGymSearch(searchTerm))
				.unwrap()
				.catch((error) => {
					console.error("Error fetching gym search results:", error);
					alert("클라이밍장 검색에 실패했습니다. 다시 시도해 주세요.");
				});

			console.log(searchResults);
		}
	};

	const selectGym = (gym) => {
		setSelectedGym(gym);
		setSearchInput("");
	};

	// const handleSearchInput = (e) => {
	// 	if (e.key === "Enter") {
	// 		setSearchQuery(searchInput);
	// 	}
	// };

	// 해시태그 추가할 때 사용,  엔터치면 해시태그가 등록됨 (게시물에 붙는거 아님 아직)
	const handleHashtagInput = (e) => {
		if (e.key === "Enter" && inputHashtag.trim() !== "") {
			const trimmedHashtag = inputHashtag.trim();
			if (!hashtags.includes(trimmedHashtag)) {
				setHashtags([...hashtags, trimmedHashtag]);
	
				dispatch(postHashtags(trimmedHashtag))
					.unwrap()
					.then((response) => {
						console.log("Hashtag added successfully:", response);
					})
					.catch((error) => {
						console.error("Failed to add hashtag:", error);
					});
			}
			setInputHashtag("");
		}
	};

	// 해시태그 제거할 때 사용
	const removeHashtag = (index) => {
		setHashtags(hashtags.filter((_, i) => i !== index));
	};

	const toggleShowAllTags = () => setShowAllTags(!showAllTags);

	// 파일 변환
	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		setUploadedFiles([...uploadedFiles, ...files]);

		const newPreviews = files.map((file) => URL.createObjectURL(file));
		setPreviews([...previews, ...newPreviews]);
	};

	// 성공 여부 저장
	const saveSuccess = () => {
		if (selectedGym) {
			const user = JSON.parse(sessionStorage.getItem("userProfile"));
	
			const formData = new FormData();
	
			const postData = {
				userId: user.id,
				gymId: selectedGym.id,
				title: "", // 빈 문자열로 설정
				content: document.querySelector(
					'textarea[placeholder="내용을 입력해 주세요."]'
				).value,
				visibility: "PUBLIC",
				success: selectedButton === "success",
			};
	
			formData.append("post", JSON.stringify(postData));
	
			uploadedFiles.forEach((file, index) => {
				formData.append(`files`, file);
			});
	
			formData.append(
				"mediaTypes",
				JSON.stringify(
					uploadedFiles.map((file) =>
						file.type.startsWith("image/") ? "IMAGE" : "VIDEO"
					)
				)
			);
	
			dispatch(postContents(formData))
				.unwrap()
				.then((response) => {
					const postId = response.postId; // 생성된 게시글의 ID를 가져옵니다.
					console.log("Post created successfully with ID:", postId);
					// 해시태그가 있을 경우, addHashtagsToPost를 호출하여 해시태그를 부착합니다.
					if (hashtags.length > 0) {
						console.log("Attaching hashtags:", hashtags);
						dispatch(addHashtagsToPost({ postId, hashtags }))
							.unwrap()
							.then(() => {
								console.log("Hashtags added successfully to the post");
							})
							.catch((error) => {
								console.error("Failed to add hashtags to the post:", error);
							});
					}
	
					setIsSuccess(true); // 성공 시
					setShowPopup(true); // 팝업 표시
					navigate(`/userPage/${userId}`);
				})
				.catch((error) => {
					console.error("Failed to post content:", error);
					setIsSuccess(false); // 실패 시
					setShowPopup(true); // 팝업 표시
				});
		} else {
			window.alert("클라이밍장을 선택해 주세요.");
		}
	};

	// 파일 삭제
	const removeFile = (index) => {
		setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
		setPreviews(previews.filter((_, i) => i !== index));
	};

	const displayedTags = showAllTags ? hashtags : hashtags.slice(0, 5);

	const handleButtonClick = (button) => {
		setSelectedButton(button);
	};

	const renderActionButton = (buttonType, label) => (
		<button
			className={`py-[1.5vh] px-[3vw] rounded-lg text-sm font-bold cursor-pointer ${
				selectedButton === buttonType
					? buttonType === "success"
						? "bg-check text-white"
						: "bg-accent text-white"
					: "bg-gray-200 text-gray-700 hover:bg-gray-300"
			} transition-colors`}
			onClick={() => handleButtonClick(buttonType)}
		>
			{label}
		</button>
	);

	// 잠금 여부 설정
	const handleLockButton = () => {
		setIsLocked((prevState) => !prevState);
	};

	const closePopup = () => setShowPopup(false); // 팝업 닫기 함수

	return (
		<div className="bg-white min-h-screen flex flex-col pt-[16vh] pb-[60px] box-border relative">
			<div className="m-[3vh] flex-grow">
				<h1 className="text-2xl font-display text-textBlack mb-[2vh] ml-1">
					피드 업로드
				</h1>
				<input
					type="text"
					placeholder="Climbing Studio"
					className="border-[2px] border-secondary outline-none rounded-[2vh] py-[1.5vh] px-[4vw] w-full text-base"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleSearchInput}
				/>
				{searchResults.length > 0 &&
					(!selectedGym || (selectedGym && searchInput)) && (
						<div className="mt-2 max-h-[200px] overflow-y-auto">
							{/* {searchResults.map((gym) => ( */}
							{searchResults.map((gym, index) => (
								<div
									key={gym.id || index}
									className="py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg"
									onClick={() => selectGym(gym)}
								>
									{gym.name}
								</div>
							))}
						</div>
					)}
				{selectedGym && (
					<div className="mt-2 text-textGray">
						클라이밍장: {selectedGym.name}
					</div>
				)}
				<div className="border-[2px] border-secondary rounded-[2vh] px-2 flex items-center mt-4">
					<span className="mx-2 font-sans text-secondary font-bold">+</span>
					<input
						type="text"
						placeholder="해시 태그 추가"
						className="bg-transparent border-none outline-none flex-grow text-base px-2 py-[1.5vh]"
						value={inputHashtag}
						onChange={(e) => setInputHashtag(e.target.value)}
						onKeyDown={handleHashtagInput}
					/>
				</div>
				{hashtags.length > 0 && (
					<div className="mt-4 px-[2vw]">
						<div className="flex flex-wrap gap-[1vh] font-sans">
							{displayedTags.map((tag, index) => (
								<span
									key={index}
									className="bg-secondary font-sans text-white px-[2vw] p-[0.5vh] rounded-[1vh] text-sm flex items-center"
								>
									{`# ${tag}`}
									<button
										className="bg-none font-sans border-none font-bold text-white ml-1 mb-[2px] text-xs cursor-pointer"
										onClick={() => removeHashtag(index)}
									>
										x
									</button>
								</span>
							))}
						</div>
						{hashtags.length > 5 && (
							<button
								className="bg-none font-sans border-none text-blue-500 text-base mt-[1vh] cursor-pointer"
								onClick={toggleShowAllTags}
							>
								{showAllTags ? "줄이기" : "더 보기"}
							</button>
						)}
					</div>
				)}
				<div className="border-[2px] border-secondary rounded-[2vh] mt-4 font-sans">
					<div className="p-[2vh]">
						<textarea
							className="w-full bg-white outline-none text-sm p-2 resize-none"
							placeholder="내용을 입력해 주세요."
						></textarea>
					</div>
				</div>
				<div className="mt-4 flex flex-col items-center">
					<div className="border-[2px] border-secondary rounded-[2vh] flex flex-col items-center justify-center w-full h-[20vh] cursor-pointer relative">
						<div
							className="text-center cursor-pointer"
							onClick={() => document.getElementById("fileInput").click()}
						>
							<img
								src={uploadIcon}
								alt="Camera icon"
								className="w-[6vh] h-[6vh] mb-[1.5vh]"
							/>
							<input
								id="fileInput"
								type="file"
								multiple
								style={{ display: "none" }}
								onChange={handleFileChange}
							/>
						</div>
						<div className="flex flex-row flex-nowrap gap-[1vh] overflow-x-auto py-[1vh] px-[2vw] mt-[2vh]">
							{previews.map((preview, index) => (
								<div
									key={index}
									className="relative min-w-[10%] h-[5vh] rounded-[1vh] overflow-hidden shadow-md transition-transform hover:scale-110"
								>
									<button
										className="absolute top-[0.5vh] right-[0.5vh] font-bold text-secondary bg-white/80 border-none rounded-full cursor-pointer text-xs p-[0.5vh]"
										onClick={() => removeFile(index)}
									>
										x
									</button>
									<img
										src={preview}
										alt={`Preview ${index}`}
										className="w-full h-full object-cover"
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center mt-8">
					<div className="flex justify-center gap-[2vw] mb-4">
						{renderActionButton("success", "성 공")}
						{renderActionButton("fail", "실 패")}
					</div>
				</div>
				<div className="flex flex-row justify-end items-center gap-3 mt-4 mr-4">
					<button
						onClick={handleLockButton}
						className="bg-white font-bold p-2 rounded-lg border border-textGray shadow-sm"
					>
						{isLocked ? (
							<img src={lock} alt="잠금" className="w-6 h-6 object-contain" />
						) : (
							<img
								src={unlock}
								alt="잠금 해제"
								className="w-6 h-6 object-contain"
							/>
						)}
					</button>
					<button
						className="bg-secondary text-white p-2 rounded-lg transition-colors duration-200 shadow-sm hover:text-textBlack"
						onClick={saveSuccess}
					>
						업로드
					</button>
				</div>
				{/* 업로드 결과 팝업 표시 */}
				{showPopup && (
					<UploadResultPopup isSuccess={isSuccess} onClose={closePopup} />
				)}
			</div>
		</div>
	);
};

export default MobileUpload;
