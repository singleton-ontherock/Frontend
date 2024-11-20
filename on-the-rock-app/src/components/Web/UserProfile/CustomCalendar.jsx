import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { getCalenderByMonth, getAuthor } from "../../../store/contentsSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../../css/CustomCalendar.css"; // 웹과 모바일에서 공통으로 사용하는 CSS

const CustomCalendar = ({ userId, onChange, value }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calendarData = useSelector((state) => state.contents.calendarData);
  const [eventsByMonth, setEventsByMonth] = useState({});
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  useEffect(() => {
    if (userId) {
      const year = moment(selectedDate).year();
      const month = moment(selectedDate).month() + 1;
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
    }
  }, [dispatch, userId, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange && onChange(date);
  };

  const handleClickDay = (date) => {
    const day = moment(date).format("D");
    if (eventsByMonth[day] && eventsByMonth[day].length > 0) {
      const postId = eventsByMonth[day][0].postId;
      dispatch(getAuthor(eventsByMonth[day][0].userId))
        .unwrap()
        .then((authorData) => {
          navigate(`/detail/${postId}`, { state: { author: authorData } });
        })
        .catch((error) => {
          console.error("Failed to fetch author data", error);
        });
    }
  };

  const addContent = ({ date, view }) => {
    const day = moment(date).format("D");
    if (view === 'month' && eventsByMonth[day] && eventsByMonth[day].length > 0) {
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

  const formatDay = (locale, date) => {
    const day = moment(date).format('D');
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
      return <span style={{ color: 'red' }}>{day}</span>;
    }
    if (dayOfWeek === 6) {
      return <span style={{ color: 'blue' }}>{day}</span>;
    }
    return day;
  };

  return (
    <div className="calendarContainer">
      <Calendar
        locale="ko"
        onChange={handleDateChange}
        value={selectedDate}
        next2Label={null}
        prev2Label={null}
        formatDay={formatDay}
        tileContent={addContent}
        showNeighboringMonth={false}
        onClickDay={handleClickDay}
      />
    </div>
  );
};

export default CustomCalendar;
