import { useState, useEffect, useRef, Fragment } from "react";
import { useParams, useLocation } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import map from "../../assets/roadmap3.png";
import edit from "../../assets/edit.svg";
import Posts from './MobileUserPosts'; 
import MobileCalendar from './MobileCalendar';
import defaultProfileImg from '../../assets/default_profile.png';
import {
  getUserProfile,
  putMyInfo,
  getUserFollowing,
  postFollow,
  postUnfollow
} from "../../store/userSlice";
import { getExperience } from "../../store/contentsSlice";
import rockIcon1 from '../../assets/yellow_rock.png';
import rockIcon2 from '../../assets/orange_rock.png';
import rockIcon3 from '../../assets/green_rock.png';
import rockIcon4 from '../../assets/blue_rock.png';
import rockIcon5 from '../../assets/red_rock.png';
import rockIcon6 from '../../assets/purple_rock.png';
import rockIcon7 from '../../assets/gray_rock.png';
import rockIcon8 from '../../assets/brown_rock.png';
import rockIcon9 from '../../assets/black_rock.png';

const MobileUserProfile = () => {
  const { id } = useParams(); 
  const [sessionId, setSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("User_Name");
  const [tempNickname, setTempNickname] = useState("");
  const [isFollowing, setIsFollowing] = useState(false); 
  const [isSameUser, setIsSameUser] = useState(id === sessionId);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const dispatch = useDispatch();
  const location = useLocation();
  const scrollContainerRef = useRef(null);

  const userFeed = useSelector((state) => state.contents.userFeed);
  const userProfile = useSelector((state) => state.user.userProfile);
  const followers = useSelector((state) => state.user.followers);
  const experience = useSelector((state) => state.contents.experience);

  const calculateExperiencePoints = (postCount, likeCount) => {
    return postCount * 5 + likeCount;
  };

  const getRockIcon = (exp) => {
    const icons = [rockIcon1, rockIcon2, rockIcon3, rockIcon4, rockIcon5, rockIcon6, rockIcon7, rockIcon8, rockIcon9];
    const index = Math.floor(exp / 100);
    return icons[Math.min(index, icons.length - 1)];
  };

  const getExperienceLevel = (exp) => {
    return Math.floor(exp / 100) + 1;
  };

  const rockIcons = [
    { src: rockIcon1, position: "right-[2vh] top-[53vh]" },
    { src: rockIcon2, position: "left-[18.2vh] top-[47.8vh]" },
    { src: rockIcon3, position: "left-[2vh] top-[41vh]" },
    { src: rockIcon4, position: "left-[13vh] top-[35vh]" },
    { src: rockIcon5, position: "right-[9vh] top-[27vh]" },
    { src: rockIcon6, position: "right-[18vh] top-[19.3vh]" },
    { src: rockIcon7, position: "left-[3vh] top-[14vh]" },
    { src: rockIcon8, position: "right-[22.7vh] top-[8vh]" },
    { src: rockIcon9, position: "right-[10.2vh] top-[1vh]" },
  ];

  useEffect(() => {
    const userProfile = sessionStorage.getItem('Profile');
    const user = sessionStorage.getItem('userProfile');
    if (user) {
      const parsedProfile = JSON.parse(user);
      setSessionId(parsedProfile.id); 
    }

    if (id) { 
      dispatch(getUserProfile(id));
      dispatch(getExperience(id));
      dispatch(getUserFollowing()).finally(() => {
        setIsLoading(false); // 모든 데이터를 불러온 후 로딩 상태를 false로 설정
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (userProfile && userProfile.nickname) {
      setNickname(userProfile.nickname);
    }
  }, [userProfile]);

  useEffect(() => {
    // sessionId와 id가 같은지 확인
    setIsSameUser(id === sessionId);
  }, [sessionId, id]);

  useEffect(() => {
    if (followers && followers.some((follower) => follower.id == parseInt(id))) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [id, followers]);

  useEffect(() => {
    const experiencePoints = calculateExperiencePoints(experience?.postCount || 0, experience?.likeCount || 0);
    const levelIndex = getExperienceLevel(experiencePoints) - 1;
    const iconElement = document.querySelector(`.rock-icon-${levelIndex}`);
    if (iconElement && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = iconElement.offsetTop - scrollContainerRef.current.clientHeight / 2 + iconElement.clientHeight / 2;
    }
  }, [experience]);

  useEffect(() => {
    const currentPath = location.pathname;
    return () => {
      if (location.pathname !== currentPath) {
        window.location.reload();
      }
    };
  }, [location]);

  const activeEnter = async (e) => {
    if (e.key === "Enter") {
      await updateNickname();
    }
  };

  const handleEditClick = async () => {
    if (id === sessionId) {
      if (isEditing) {
        await updateNickname();
      } else {
        setTempNickname(nickname);
        setIsEditing(true);
      }
    }
  };

  const handleFollowClick = async () => {
    if (sessionId && id !== sessionId) {
      if (isFollowing) {
        await dispatch(postUnfollow(id)).unwrap();
        setIsFollowing(false);
      } else {
        await dispatch(postFollow(id)).unwrap();
        setIsFollowing(true);
      }
      dispatch(getUserFollowing());
    }
  };

  const updateNickname = async () => {
    if (tempNickname !== nickname) {
      dispatch(putMyInfo({ nickname: tempNickname }));
      setNickname(tempNickname);
    }
    setIsEditing(false);
  };

  const handleNicknameChange = (e) => {
    setTempNickname(e.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 화면 또는 컴포넌트를 표시
  }

  return (
    <div className="w-full flex flex-col items-center text-textBlack font-sans p-4">
      <div className="w-full flex flex-row justify-between items-center p-4">
        <div className="flex flex-row items-center gap-1 mt-[15vh]">
          <img
            className="w-[11vh] h-[11vh] rounded-full object-cover mr-2"
            src={userProfile.profilePicture || defaultProfileImg} 
            alt="Profile"
          />
          <div className="flex flex-col">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <img className="w-8 h-6" src={getRockIcon(calculateExperiencePoints(experience?.postCount || 0, experience?.likeCount || 0))} alt="icon" />
                {isEditing ? (
                  <input
                    type="text"
                    value={tempNickname}
                    onKeyDown={activeEnter}
                    onChange={handleNicknameChange}
                    className="text-black p-1 rounded-lg w-[12vh] border-2 border-secondary outline-none"
                  />
                ) : (
                  <span className="font-bold">{nickname}</span>
                )}
                {isSameUser && (
                  <img
                    className="w-6 h-6 ml-2 cursor-pointer transform hover:scale-125 transition-transform"
                    src={edit}
                    alt="edit"
                    onClick={handleEditClick}
                  />
                )}
                {!isSameUser && (
                  <button
                    onClick={handleFollowClick}
                    className="ml-[6vh] p-2 bg-secondary text-sm text-white rounded-lg"
                  >
                    {isFollowing ? "언팔로우" : "팔로우"}
                  </button>
                )}
              </div>  
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4 mb-[6vh]">
        <div  ref={scrollContainerRef} className="relative w-full max-w-lg h-[200px] overflow-y-auto rounded-xl border-2">
          <img className="absolute top-0 left-0 w-full object-cover" src={map} alt="map" />
          {rockIcons.map((icon, index) => (
            <Fragment key={index}>
              {index === getExperienceLevel(calculateExperiencePoints(experience?.postCount || 0, experience?.likeCount || 0)) - 1 && (
                <img
                  className={`absolute w-8 h-8 rock-icon-${index} ${icon.position} rounded-full object-cover`}
                  src={userProfile.profilePicture || defaultProfileImg}
                  alt="Profile"
                />
              )}
            </Fragment>
          ))}
        </div>
        <div className="w-full flex justify-center gap-12 bg-white p-4 border-b border-gray-300">
          <div
            className={`cursor-pointer text-lg font-bold ${activeTab === 'feed' ? 'text-textBlack' : 'text-textGray'}`}
            onClick={() => setActiveTab('feed')}
          >
            피드
          </div>
          <div className="text-textGray">|</div>
          <div
            className={`cursor-pointer text-lg font-bold ${activeTab === 'calendar' ? 'text-textBlack' : 'text-textGray'}`}
            onClick={() => setActiveTab('calendar')}
          >
            캘린더
          </div>
        </div>
        {activeTab === 'feed' && (
          <div className="w-full max-w-lg mb-7">
            <Posts userFeed={userFeed}/>
          </div>
        )}
        {activeTab === 'calendar' && (
          <div className="w-full flex justify-center max-w-lg">
            <MobileCalendar />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileUserProfile;
