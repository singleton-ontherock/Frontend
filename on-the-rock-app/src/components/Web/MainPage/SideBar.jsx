import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFollowerStatus } from '../../../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import defaultImg from '../../../assets/default_profile.png';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const followerData = useSelector((state) => state.user.followerStatus);

  useEffect(() => {
    dispatch(getFollowerStatus());
  }, [dispatch]);

  const handleProfileClick = (follower) => {
    if (follower.streamingSessionId) {
      navigate(`/StreamingPage/${follower.streamingSessionId}`);
    } else {
      navigate(`/userPage/${follower.userId}`);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`relative transition-all duration-300 ease-in-out border-r border-textGray border-opacity-40 h-screen flex flex-col items-center p-10 shadow-lg ${isOpen ? 'w-[25vh]' : 'w-[60px]'}`}>
      <button
        onClick={toggleSidebar}
        className="absolute top-1/4 -right-3 w-6 h-12 bg-secondary rounded-md flex items-center justify-center z-10"
      >
        {isOpen ? <ChevronLeft className="text-white" size={20} /> : <ChevronRight className="text-primary" size={20} />}
      </button>
      <div className="overflow-y-auto no-scrollbar w-full h-full">
        {followerData.map((follower, index) => (
          <div
            key={`${follower.userId}-${index}`}
            className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-16 h-16' : 'w-8 h-8'} rounded-full mb-5 cursor-pointer ${follower.streamingSessionId ? 'border-[2px] border-accent' : ''}`}
            onClick={() => handleProfileClick(follower)}
          >
            <img 
              src={follower.profilePicture || defaultImg} 
              alt={follower.name || 'User'} 
              className="w-full h-full rounded-full object-cover"
              onError={(e) => { e.target.src = defaultImg; }}
            />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
