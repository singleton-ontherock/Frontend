import { Provider } from "react-redux";
import { Routes, Route } from "react-router-dom";
import store from "./store/store";
import MobileSearchPage from "./components/Mobile/MobileSearchPage";
import MobileSearchList from "./components/Mobile/MobileSearchList";
import MobileUpload from "./components/Mobile/MobileUploader";
import MobileMainPage from "./components/Mobile/MobileMainPage";
import MobileFeedDetail from "./components/Mobile/MobileFeedDetail";
import HeaderNavMobileLogin from "./components/Mobile/MobileHeader";
import FooterMobileLogin from "./components/Mobile/MobileFooter";
import MobileStreamingPage from "./components/Mobile/MobileStreamPage";
import MobileUserProfile from "./components/Mobile/MobileMypage";
import MobileAlarm from "./components/Mobile/MobileAlarm";
import Analyze from "./components/Mobile/MobileAnalyze";
import Session from "./components/OpenVidu/Session";
import PrivateRoute from "./PrivateRoute";

function Mobile() {
	return (
		<Provider store={store}>
			<div className="safe-area">
				{" "}
				{/* Safe Area 적용 */}
				<HeaderNavMobileLogin />
				<div className="App bg-white font-sans">
					<Routes>
						<Route path="/" element={<MobileMainPage />} />
						<Route element={<PrivateRoute />}>
							<Route path="/detail/:postId" element={<MobileFeedDetail />} />
							<Route path="/search" element={<MobileSearchPage />} />
							<Route path="/searchList" element={<MobileSearchList />} />
							<Route path="/upload" element={<MobileUpload />} />
							<Route path="/streaming" element={<MobileStreamingPage />} />
							<Route path="/userPage/:id" element={<MobileUserProfile />} />
							<Route path="/alarm" element={<MobileAlarm />} />
							<Route path="/analyze" element={<Analyze />} />
							<Route
								path="/streaming/:sessionId"
								element={<MobileStreamingPage />}
							/>
						</Route>
					</Routes>
				</div>
				<FooterMobileLogin />
			</div>
		</Provider>
	);
}

export default Mobile;
