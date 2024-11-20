import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DefaultProfileImg from "../../assets/default_profile.png";
import { toggleLoginPopUp } from "../../store/store.js";
import SearchIcon from "../../assets/search.svg";
import StreamingIcon from "../../assets/streaming.svg";
import UploadIcon from "../../assets/upload.svg";
import AnalyzeIcon from "../../assets/analyze_icon.svg";
import { useEffect, useState } from "react";

// Footer 아이콘 컴포넌트
const FooterIcon = ({ src, alt, onClick }) => (
  <div className="flex items-center justify-center mx-2 cursor-pointer">
    <img
      className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 object-contain"
      src={src}
      alt={alt}
      onClick={onClick}
    />
  </div>
);

const FooterMobileLogin = () => {
  const [userProfile, setUserProfile] = useState(
    () => JSON.parse(sessionStorage.getItem("userProfile")) || {}
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user.isLoggedIn) {
        try {
          const profileData = JSON.parse(sessionStorage.getItem("userProfile"));
          if (profileData) {
            setUserProfile(profileData);
            // console.log(
            //   "User profile data loaded from session storage:",
            //   profileData
            // );
          }
        } catch (error) {
          console.error(
            "Error fetching profile data:",
            error.response ? error.response.data : error.message
          );
        }
      }
    };
    fetchUserProfile();
  }, [user.isLoggedIn]);

  const handleNavigation = (path, requireLogin = true) => {
    if (requireLogin && !user.isLoggedIn) {
      window.alert("잘못된 접근입니다.");
      dispatch(toggleLoginPopUp());
    } else {
      const userId = JSON.parse(sessionStorage.getItem("userProfile")).id;
      const userProfilePath = path.replace("{}", userId);
      navigate(userProfilePath);

    }
  };

	const navigateToUserPage = () => {
		const userProfileData = sessionStorage.getItem("userProfile");
    console.log(userProfileData);
		if (userProfileData) {
			const userId = JSON.parse(userProfileData).id;
      console.log('userId',userId);
			if (userId) {
				navigate(`/userPage/${userId}`);
			} else {
				console.error("User ID not found in session storage");
				dispatch(toggleLoginPopUp());
			}
		} else {
			console.error("User profile not found in session storage");
			dispatch(toggleLoginPopUp());
		}
	};

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[55px] md:h-[60px] lg:h-[65px] flex justify-between items-center px-4 bg-white">
      <div className="flex justify-between items-center w-full">
        <FooterIcon
          src={SearchIcon}
          alt="Search"
          onClick={() => handleNavigation("/search")}
        />
        <FooterIcon
          src={StreamingIcon}
          alt="Streaming"
          onClick={() => handleNavigation("/streaming")}
        />
        <FooterIcon
          src={UploadIcon}
          alt="Upload"
          onClick={() => handleNavigation("/upload")}
        />
        <FooterIcon
          src={AnalyzeIcon}
          alt="Analyze"
          onClick={() => handleNavigation("/analyze")}
        />
        <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden cursor-pointer relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <img
            className={`w-full h-full object-cover ${
              imageLoaded ? "visible" : "invisible"
            }`}
            src={
              user.isLoggedIn && userProfile && userProfile.profilePicture
                ? userProfile.profilePicture
                : DefaultProfileImg
            }
            alt="Profile"
            onClick={navigateToUserPage}
            onLoad={handleImageLoad}
            onError={() => {
              setImageLoaded(true);
              // 에러 발생 시 기본 이미지로 대체
              if (userProfile) {
                setUserProfile({
                  ...userProfile,
                  profilePicture: DefaultProfileImg,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FooterMobileLogin;
