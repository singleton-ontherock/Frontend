import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  getUserProfile,
  putMyInfo,
  getUserFollowing,
  postFollow,
  postUnfollow,
} from "../../../store/userSlice";
import { getExperience, getUserFeed } from "../../../store/contentsSlice";
import edit from "../../../assets/edit.svg";
import map from "../../../assets/roadmap3.png";
import CustomCalendar from './CustomCalendar';
import Feed from './Feed';
import defaultProfileImg from '../../../assets/default_profile.png';

import rockIcon1 from '../../../assets/yellow_rock.png';
import rockIcon2 from '../../../assets/orange_rock.png';
import rockIcon3 from '../../../assets/green_rock.png';
import rockIcon4 from '../../../assets/blue_rock.png';
import rockIcon5 from '../../../assets/red_rock.png';
import rockIcon6 from '../../../assets/purple_rock.png';
import rockIcon7 from '../../../assets/gray_rock.png';
import rockIcon8 from '../../../assets/brown_rock.png';
import rockIcon9 from '../../../assets/black_rock.png';

const UserProfileDetails = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('User_Name');
  const [tempNickname, setTempNickname] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const scrollContainerRef = useRef(null);

  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);
  const experience = useSelector((state) => state.contents.experience);
  const followers = useSelector((state) => state.user.followers);
  const userFeed = useSelector((state) => state.contents.userFeed);
  const sessionId = useSelector((state) => state.user.sessionId);

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId));
      dispatch(getExperience(userId));
      dispatch(getUserFeed(userId));
      dispatch(getUserFollowing());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userProfile && userProfile.nickname) {
      setNickname(userProfile.nickname);
    }
  }, [userProfile]);

  useEffect(() => {
    if (followers && followers.some((follower) => follower.id === parseInt(userId))) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [followers, userId]);

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

  const activeEnter = async (e) => {
    if (e.key === "Enter") {
      await updateNickname();
    }
  };

  const handleEditClick = async () => {
    if (userId == sessionId) {
      if (isEditing) {
        await updateNickname();
      } else {
        setTempNickname(nickname);
        setIsEditing(true);
      }
    }
  };

  const handleFollowClick = async () => {
    if (sessionId && userId != sessionId) {
      if (isFollowing) {
        dispatch(postUnfollow(userId));
      } else {
        dispatch(postFollow(userId));
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

  const goToCalendar = () => {
    setActiveTab('calendar');
  };

  const goToFeed = () => {
    setActiveTab('feed');
  };

  return (
    <div className="flex flex-col p-8 rounded-lg bg-white text-textBlack overflow-y-auto">
      <div className="w-full bg-white flex justify-start items-start border-b border-gray-300 pb-5 mb-5">
        <div className="flex flex-row items-center gap-6 mt-5 ml-5">
          <img className="w-24 h-24 rounded-full border border-textGray object-cover" src={userProfile.profilePicture || defaultProfileImg} alt="Profile" />
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img className="w-11 h-8" src={getRockIcon(calculateExperiencePoints(experience?.postCount || 0, experience?.likeCount || 0))} alt="icon" />
              {isEditing ? (
                <input
                  type="text"
                  value={tempNickname}
                  onKeyDown={activeEnter}
                  onChange={handleNicknameChange}
                  className="text-textBlack font-bold p-1 rounded w-[60%] border border-secondary"
                />
              ) : (
                <span className="text-textBlack font-bold">{nickname}</span>
              )}
              {userId == sessionId && (
                <img
                  className="w-6 h-6 cursor-pointer transform hover:scale-125 transition-transform"
                  src={edit}
                  alt="edit"
                  onClick={handleEditClick}
                />
              )}
              {userId != sessionId && (
                <button
                  onClick={handleFollowClick}
                  className="ml-5 px-2 py-1 bg-secondary text-white rounded-lg"
                >
                  {isFollowing ? "언팔로우" : "팔로우"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4">
        <div ref={scrollContainerRef} className="relative w-full h-[300px] overflow-y-auto rounded-xl">
          <img className="absolute top-0 left-0 w-full object-cover" src={map} alt="map" />
          <Fragment>
            {userProfile && experience && (
              <img
                className={`absolute w-16 h-16 rounded-full object-cover`}
                src={userProfile.profilePicture || defaultProfileImg}
                alt="Profile"
                style={{
                  top: `${50 - getExperienceLevel(calculateExperiencePoints(experience?.postCount || 0, experience?.likeCount || 0)) * 10}%`,
                  left: `50%`,
                  transform: `translate(-50%, -50%)`
                }}
              />
            )}
          </Fragment>
        </div>
        <div className="w-full flex justify-center gap-12 bg-white p-4 border-b border-gray-300">
          <div
            className={`cursor-pointer text-xl font-bold ${activeTab === 'feed' ? 'text-textBlack' : 'text-textGray'}`}
            onClick={goToFeed}
          >
            피드
          </div>
          <div className="text-textGray">|</div>
          <div
            className={`cursor-pointer text-xl font-bold ${activeTab === 'calendar' ? 'text-textBlack' : 'text-textGray'}`}
            onClick={goToCalendar}
          >
            캘린더
          </div>
        </div>
        <div className="w-5/6 flex flex-col items-center py-[5vh]">
          {activeTab === 'feed' ? (
            <Feed userId={userId} />
          ) : (
            <CustomCalendar userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetails;
