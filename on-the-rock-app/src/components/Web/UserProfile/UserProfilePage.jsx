import SideBar from '../MainPage/SideBar';
import UserProfileDetails from './UserProfileDetails';
import { useParams } from 'react-router-dom';

const UserProfile = () => {

  // 라우터 사용 시 파라미터 정보를 가져와 활용
  const { userId } = useParams();

  return (
    <div className='flex min-h-screen pt-[7vh]'>
    <div className="flex flex-row flex-1">
      <div className="mr-4">
        <SideBar />
      </div>
      <div className="flex-1 p-5 shadow-md rounded-md ml-5 overflow-hidden my-[5vh]">
        <UserProfileDetails  userId={userId} />
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
