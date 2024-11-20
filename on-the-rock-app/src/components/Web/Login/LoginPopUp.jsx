import { useDispatch } from 'react-redux';
import { login } from '../../../store/userSlice';
import NaverButton from '../../../assets/네이버_로그인.png';
import KakaoButton from '../../../assets/카카오_로그인.png';
import closeIcon from '../../../assets/close.svg';
import Cookies from 'js-cookie';

// 임예원 (2024.07.19 수정)
// 로그인 버튼을 누르면 뜨는 팝업 생성
const NAVER_CLIENT_ID = import.meta.env.VITE_APP_NAVER_CLIENT_ID; //Vite 프로젝트는 환경변수를 import.meta로 가져옴

const NAVER_REDIRECT_URI = "https://ontherock.lol:8000/auth/naver/callback";
const STATE = encodeURIComponent(NAVER_REDIRECT_URI);
const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?&response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=c7fd2df59841f58697aad5bc66faffc7&redirect_uri=https://ontherock.lol:8000/auth/kakao/callback&response_type=code`


const TEST_URL = "https://ontherock.lol:8000/auth/test";

const LoginPopUp = ({ closePopUp }) => {
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      // TEST_URL에서 사용자 데이터 가져오기
      const response = await fetch(TEST_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch test users.');
      }
      
      const users = await response.json();

      
      // 임의로 첫 번째 사용자 선택 (원하는 로직으로 변경 가능)
      const randomUser = users[0];
      
      // accessTokend와 refreshToken을 쿠키에 저장
      Cookies.set('accessToken', randomUser.accessToken, { secure: true, sameSite: 'Strict' });
      Cookies.set('refreshToken', randomUser.refreshToken, { secure: true, sameSite: 'Strict' });
      
  
      // 로그인 액션 디스패치
      dispatch(login({ userId: randomUser.userId, accessToken: randomUser.accessToken, refreshToken: randomUser.refreshToken }));
  
      // 세션 스토리지에 사용자 정보 저장 (필요하다면)
      sessionStorage.setItem('userProfile', JSON.stringify(randomUser));
  
      // 팝업 닫기
      closePopUp();
  
    } catch (error) {
      console.error('Error during test login:', error);
    }
  };


  const handleNaverLogin = () => {
    window.location.href = NAVER_AUTH_URL; //백에서 토큰을 넘겨줌
  };

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL; //백에서 토큰을 넘겨줌
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg text-center w-full max-w-xs md:max-w-lg lg:max-w-xl">
        <h2 className="mb-10 text-2xl font-display font-extrabold">OnTheRock 로그인</h2>
        <button 
          onClick={handleNaverLogin} 
          className="relative w-[80%] h-12 bg-[#03c75a] my-4 rounded flex items-center justify-center mx-auto"
        >
          <img
            src={NaverButton}
            alt="네이버"
            className="max-w-full max-h-full"
          />
        </button>
        <button 
          onClick={handleKakaoLogin} 
          className="relative w-[80%] h-12 bg-[#FEE500] my-4 rounded flex items-center justify-center mx-auto"
        >
          <img
            src={KakaoButton}
            alt="카카오"
            className="max-w-full max-h-full"
          />
        </button>
        <div className="flex justify-end">
          <button
            onClick={handleLogin}
            className="bg-secondary text-white py-2 px-2 rounded-lg"
          >
            로그인
          </button>
          <button
            onClick={closePopUp}
            className="absolute top-2 right-2 text-2xl cursor-pointer text-textBlack"
          >
            <img src={closeIcon} alt="X" className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopUp;
