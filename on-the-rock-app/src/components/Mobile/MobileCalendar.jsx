import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../css/CustomCalendar.css";
import moment from "moment";
import { getCalenderByMonth, getAuthor } from "../../store/contentsSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function MobileCalendar() {
	//haejun mypage, calendar
	const [value, onChange] = useState(new Date());
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const calenderByMonth = useSelector(
		(state) => state.contents.calenderByMonth
	);
	const author = useSelector((state) => state.contents.author);
	const [eventsByMonth, setEventsByMonth] = useState([]);

	useEffect(() => {
		const userId = JSON.parse(sessionStorage.getItem("userProfile")).id;

		// console.log(moment(nowDate));

		const year = value.getFullYear(); // 활성화된 달의 연도
		const month = value.getMonth() + 1; // 활성화된 달의 월 (0부터 시작하므로 +1 필요)

		console.log(`Fetching data for year: ${year}, month: ${month}`);

		dispatch(getCalenderByMonth({ userId, year, month }))
			.unwrap()
			.then((events) => {
				const eventsMap = {};
				events.forEach((event) => {
					const day = moment(event.createdAt).format("D");
					if (!eventsMap[day]) {
						eventsMap[day] = [];
					}
					eventsMap[day].push(event);
				});
				setEventsByMonth(eventsMap);
			});
	}, [value, dispatch]);

	// 날짜가 변경될 때 호출되는 핸들러 함수
	const handleDateChange = (selectedDate) => {
		onChange(selectedDate); // 부모 컴포넌트에 변경된 날짜를 전달합니다.
	};

	// 날짜를 클릭했을 때 호출되는 함수
	// 현재는 그 날의 첫번째 게시물로 라우팅하는것으로 로직을 대체하였다.
	// 추후에 바뀔 예정
	const handleClickDay = (date) => {
		const day = moment(date).format("D");
		console.log(eventsByMonth[day]);
		if (eventsByMonth[day] && eventsByMonth[day].length > 0) {
			const postId = eventsByMonth[day][0].postId;
			dispatch(getAuthor(eventsByMonth[day][0].userId))
				.unwrap()
				.then((authorData) => {
					console.log("POST ID : " + postId + " " + " AUTHOR : " + authorData);
					navigate(`/detail/${postId}`, { state: { author: authorData } });
				})
				.catch((error) => {
					console.error("Failed to fetch author data", error);
				});
		}
	};

	// 각 날짜 타일에 추가할 내용을 정의하는 함수
	const addContent = ({ date, view }) => {
		const day = moment(date).format("D");
		if (eventsByMonth[day] && eventsByMonth[day].length > 0) {
			return (
				<div
					style={{
						backgroundColor: "lightgreen",
						borderRadius: "50%",
						width: "20px",
						height: "20px",
						margin: "0 auto",
					}}
				></div>
			);
		}
		return null;
	};

	// 날짜 포맷을 설정하고 일요일은 빨간색, 토요일은 파란색으로 표시하는 함수
	const formatDay = (locale, date) => {
		const day = moment(date).format("D");
		const dayOfWeek = date.getDay();
		if (dayOfWeek === 0) {
			return <span style={{ color: "red" }}>{day}</span>; // 일요일 빨간색
		}
		if (dayOfWeek === 6) {
			return <span style={{ color: "blue" }}>{day}</span>; // 토요일 파란색
		}
		return day;
	};

	return (
		<div className="calendarContainer">
			<Calendar
				locale="ko"
				onChange={handleDateChange}
				value={value}
				next2Label={null}
				prev2Label={null}
				formatDay={formatDay}
				tileContent={addContent} // 날짜 타일에 컨텐츠 추가
				showNeighboringMonth={false}
				onClickDay={handleClickDay} // 날짜 클릭 이벤트 핸들러 추가
			/>
		</div>
	);
}

export default MobileCalendar;
