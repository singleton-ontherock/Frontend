
import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import store from './store/store';
import MainPage from './components/Web/MainPage/MainPage';
import NavBar from './components/Web/NavBar/NavBar';
import StreamingPage from './components/Web/Streaming/StreamingPage';
import UploadPage from './components/Web/Upload/UploadPage';
import FeedSearchResult from './components/Web/Feed/FeedSearchResult';
import UserProfile from './components/Web/UserProfile/UserProfilePage';
import FeedDetail from './components/Web/Feed/FeedDetail';
import Analyze from './components/Web/Analyze/Analyze';

function Web() {
  return (
    <Provider store={store}>
      <div className='bg-white font-sans'>
        <NavBar />
        <div className='App'>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/streaming" element={<StreamingPage />} />
            <Route path="/streaming/:sessionId" element={<StreamingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/feedSearchResult" element={<FeedSearchResult />} />
            <Route path="/userPage/:userId" element={<UserProfile />} />
            <Route path="/detail/:postId" element={<FeedDetail/>} />
            <Route path="/analyze" element={<Analyze/>} />
          </Routes>
        </div>
      </div>
    </Provider>
  );
}

export default Web;
