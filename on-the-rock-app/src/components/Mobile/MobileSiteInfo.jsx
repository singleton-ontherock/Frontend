import { toggleLoginPopUp } from '../../store/store';
import { useDispatch } from 'react-redux';

function SiteInfo() {
    const dispatch = useDispatch();

    const openLoginPopUp = () => {
        dispatch(toggleLoginPopUp());
    };

    return (
        <section className="p-6 mt-[7vh] h-1/5">
          <h1 className="text-2xl font-display font-bold text-textBlack mb-2">OnTheRock은</h1>
          <p className="text-sm font-sans text-textBlack mb-3">클라이밍 애호가들이 자신의 기록을 공유하고 소통하며 함께 성장할 수 있는 플랫폼입니다.</p>
          <button className="px-3 py-2 bg-secondary text-white text-sm rounded-md" onClick={openLoginPopUp}>가입하기</button>
        </section>
    );
}

export default SiteInfo;
