import { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLoginPopUp } from '../../../store/store';
import LoginPopUp from '../Login/LoginPopUp';
import HotClips from './HotClips';
import SideBar from './SideBar';
import SiteInfo1 from '../../../assets/SiteInfo1.png';
import SiteInfo2 from '../../../assets/SiteInfo2.png';
import HotClipIcon from '../../../assets/HotClipIcon.png';
import Select from "react-select";
import { getHotClips } from "../../../store/contentsSlice";

// 정렬 토글 스타일 적용
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "1rem",
    padding: "0.1rem",
    backgroundColor: "#8090BF",
    borderColor: state.isFocused ? "#8090BF" : "transparent", // 포커스 시 테두리 색상 변경
    boxShadow: "#ffffff",
    "&:hover": {
      borderColor: "#ffffff", // 포커스 시 호버 테두리 색상 변경
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    backgroundColor: "#ffffff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#8090BF" : "#ffffff",
    color: state.isFocused ? "#ffffff" : "#777777",
    fontStyle: "sans",
    borderRadius: "0.5rem",
    margin: "0px 3px",
    width: "95%",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
};

const MainPage = () => {
  const isLoginPopUpOpen = useSelector((state) => state.app.isLoginPopUpOpen);
  const user = useSelector((state) => state.user || []);
  const hotClips = useSelector((state) => state.contents.hotClips);
  const dispatch = useDispatch();

  const [currentImage, setCurrentImage] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const mainRef = useRef(null);

  // 서버로부터 인기 클립을 가져오는 API 호출 (최초 1회만 실행)
  useEffect(() => {
    if (!hotClips.length) {
      dispatch(getHotClips());
    }
  }, [dispatch, hotClips.length]);

  useEffect(() => {
    let fadeEffect;
    if (currentImage === 0) {
      fadeEffect = setInterval(() => {
        setOpacity((prev) => {
          if (prev > 0) {
            return prev - 0.01;
          } else {
            setCurrentImage(1);
            clearInterval(fadeEffect);
            return 0;
          }
        });
      }, 20); // 더 천천히 opacity를 낮춤
    } else {
      setOpacity(1);
    }

    return () => clearInterval(fadeEffect);
  }, [currentImage]);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        const position = mainRef.current.scrollTop;
        setScrollPosition(position);
      }
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const openLoginPopUp = () => {
    dispatch(toggleLoginPopUp());
  };

  const handleSelectChange = (option) => {
    setSelectedOption(option);
  };

  const renderImageSection = (src, alt, index) => {
    const isVisible = index === currentImage;
    const scrollOpacity = isVisible ? 1 - scrollPosition / 300 : 0;
    const transform = isVisible ? `translateY(-${Math.min(scrollPosition / 2, 50)}px)` : 'translateY(0)';

    return (
      <div 
        className={`h-full mb-5 overflow-hidden transition-opacity duration-1000 ease-in-out absolute top-0 left-0 right-0 rounded-sm`}
        style={{ 
          opacity: isVisible ? opacity * scrollOpacity : 0, transform }}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    );
  };

  // 정렬된 데이터 생성: 최신 순 또는 좋아요 순으로 정렬
  const sortedData = useMemo(() => {
    if (!hotClips || !Array.isArray(hotClips)) {
      return []; // hotClips가 undefined일 경우 빈 배열 반환
    }

    const clipsWithDetails = hotClips.map((clip) => ({
      ...clip,
      author: clip.post.userId,  // 사용자 ID를 author로 설정
      likeCount: clip.likeCount, // likeCount를 직접 사용
      createdAt: clip.post.createdAt,  // createdAt을 post에서 가져옴
    }));

    if (selectedOption?.value === "최신 순") {
      return [...clipsWithDetails].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    if (selectedOption?.value === "좋아요 순") {
      return [...clipsWithDetails].sort((a, b) => b.likeCount - a.likeCount);
    }

    return clipsWithDetails;
  }, [hotClips, selectedOption]);

  return (
    <>
      <div className={`flex min-h-screen pt-[70px] ${user.isLoggedIn ? '' : 'flex-col'}`}>
        {!user.isLoggedIn && (
          <main ref={mainRef} className="flex flex-col flex-1 relative">
            <div className="relative h-screen">
              {renderImageSection(SiteInfo1, '사이트설명1', 0)}
              {renderImageSection(SiteInfo2, '사이트설명2', 1)}
            </div>
            <section className="flex flex-col p-10 mx-5 mt-3 overflow-hidden">
              <div className='flex flex-col justify-center items-center shadow-lg'>
                <img src={HotClipIcon} alt="hotclips" className='w-60 h-30 mb-8'/>
                {/* sortedData를 HotClips 컴포넌트로 전달 */}
                <HotClips clips={sortedData} />
              </div>  
            </section>
          </main>
        )}

        {user.isLoggedIn && (
          <main className="flex flex-row flex-1">
            <div className="mr-4 h-screen">
              <SideBar />
            </div>
              {user.isLoggedIn && (
                <section className="flex-1 p-20 ml-5 overflow-hidden">
                  <div className='shadow-md'>
                    <div className='flex justify-between items-center mb-3'>
                      <img src={HotClipIcon} alt="hotclips" className='w-46 h-20 ml-10'/>
                      <div className="rounded-md w-[20vh] mr-10">
                        <Select
                          styles={customStyles}
                          value={selectedOption}
                          onChange={handleSelectChange}
                          placeholder="정렬 기준"
                          options={[
                            { value: '최신 순', label: '최신 순' },
                            { value: '좋아요 순', label: '좋아요 순' },
                          ]}
                        />
                      </div>
                    </div>
                    <div className='flex justify-center'>
                      {/* sortedData를 HotClips 컴포넌트로 전달 */}
                      <HotClips clips={sortedData} />
                    </div>
                  </div>
                </section>
              )}
          </main>
        )}
      </div>
      {isLoginPopUpOpen && <LoginPopUp closePopUp={openLoginPopUp} />}
    </>
  );
};

export default MainPage;