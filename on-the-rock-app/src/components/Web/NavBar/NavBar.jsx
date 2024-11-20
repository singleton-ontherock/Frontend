import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLoginPopUp, toggleAlarm } from '../../../store/store';
import { logout, getUserProfile } from '../../../store/userSlice';
import Search from '../MainPage/Search';
import LoginPopUp from '../Login/LoginPopUp';
import AlarmPopUp from './Alarm';
import DefaultProfileImg from '../../../assets/default_profile.png';
import AlarmIcon from '../../../assets/alarm.svg';
import Logo from '../../../assets/Logo.png';
import Cookies from 'js-cookie';

const NavBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [userProfile, setUserProfile] = useState(
    () => JSON.parse(sessionStorage.getItem("userProfile")) || {}
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.user);
  const isLoginPopUpOpen = useSelector((state) => state.app.isLoginPopUpOpen);
  const isAlarmOpen = useSelector((state) => state.alarm.isAlarmOpen);

  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(getUserProfile(user.userId));
    }
  }, [user.isLoggedIn, dispatch, user.userId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user.isLoggedIn) {
        try {
          const profileData = JSON.parse(sessionStorage.getItem("userProfile"));
          if (profileData) {
            setUserProfile(profileData);
            console.log(
              "User profile data loaded from session storage:",
              profileData
            );
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

  const handleSearchClick = () => {
    if (!user.isLoggedIn) {
      openLoginPopUp();
    } else {
      setShowSearch(!showSearch);
    }
  };

  const openLoginPopUp = () => {
    dispatch(toggleLoginPopUp());
  };

  const openAlarmPopUp = () => {
    dispatch(toggleAlarm());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userFollower");
    Cookies.remove("refreshToken");
    Cookies.remove("userProfile");
    dispatch(logout());
  };

  const handleClick = () => {
    if (user.isLoggedIn) {
      handleLogout();
    } else {
      openLoginPopUp();
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  const goToStreamingPage = () => {
    if (!user.isLoggedIn) {
      openLoginPopUp();
    } else {
      navigate('/streaming'); 
    }
  };

  const goToUploadPage = () => {
    if (!user.isLoggedIn) {
      openLoginPopUp();
    } else {
      navigate('/upload');
    }
  };

  const goToUserPage = () => {
    if (!user.isLoggedIn) {
      openLoginPopUp();
    } else {
      navigate(`/userPage/${user.userId}`);
    }
  };

  const goToAnalyzePage = () => {
    if (!user.isLoggedIn) {
      openLoginPopUp();
    } else {
      navigate('/analyze');
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <header className="fixed bg-white top-0 left-0 right-0 flex items-center justify-between font-sans px-4 md:px-8 lg:px-32 shadow-md h-[70px] z-50">
      <img src={Logo} alt="logo" className="h-10 cursor-pointer" onClick={goToHome} />
      <nav className="flex gap-4 md:gap-4 lg:gap-5 xl:gap-20 grow justify-center hidden md:flex">
        <button
          className="px-2 md:px-3 lg:px-4 py-1 md:py-2 text-textPrimary hover:font-bold rounded-md font-sans text-[clamp(0.75rem, 1vw, 1rem)] cursor-pointer"
          onClick={handleSearchClick}
        >
          검색
        </button>
        <button
          className="px-2 md:px-3 lg:px-4 py-1 md:py-2 text-textPrimary hover:font-bold rounded-md font-sans text-[clamp(0.75rem, 1vw, 1rem)] cursor-pointer"
          onClick={goToStreamingPage}
        >
          스트리밍
        </button>
        <button
          className="px-2 md:px-3 lg:px-4 py-1 md:py-2 text-textPrimary hover:font-bold rounded-md font-sans text-[clamp(0.75rem, 1vw, 1rem)] cursor-pointer"
          onClick={goToUploadPage}
        >
          업로드
        </button>
        <button
          className="px-2 md:px-3 lg:px-4 py-1 md:py-2 text-textPrimary hover:font-bold rounded-md font-sans text-[clamp(0.75rem, 1vw, 1rem)] cursor-pointer"
          onClick={goToAnalyzePage}
        >
          영상 분석
        </button>
      </nav>

      <div className="flex items-center">
        {user.isLoggedIn && (
          <div
            className="mx-3 md:mx-5 cursor-pointer pr-2"
            onClick={openAlarmPopUp}
          >
            <img
              src={AlarmIcon}
              alt="Alarm"
              className="h-7 md:h-8 w-7 md:w-8"
            />
          </div>
        )}

        <button 
          className="px-3 md:px-4 py-1 md:py-2 mr-5 md:mr-8 bg-secondary text-white rounded-md cursor-pointer shadow-sm text-sm md:text-md hover:shadow-md"
          onClick={handleClick}
        >
          {user.isLoggedIn ? '로그아웃' : '로그인'}
        </button>

        <div className="flex items-center justify-center cursor-pointer" onClick={goToUserPage}>
          <div className="w-8 md:w-10 h-8 md:h-10 bg-background rounded-full overflow-hidden relative">
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
              alt="User Icon"
              onLoad={handleImageLoad}
              onError={() => {
                setImageLoaded(true);
                setUserProfile({
                  ...userProfile,
                  profilePicture: DefaultProfileImg,
                });
              }}
            />
          </div>
        </div>
      </div>

      {showSearch && <Search onSearchClick={handleSearchClick} />}
      {isLoginPopUpOpen && <LoginPopUp closePopUp={openLoginPopUp} />}
      {isAlarmOpen && <AlarmPopUp onClose={openAlarmPopUp} />}
    </header>
  );
};

export default NavBar;
