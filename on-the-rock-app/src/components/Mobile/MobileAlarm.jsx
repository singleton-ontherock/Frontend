import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/index';

const NotificationCard = ({ onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/sender/notification');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    navigate(-1);
  };

  return (
    <div className="w-full h-full p-[3vh] relative mt-[17vh] font-sans">
      <h3 className="mb-8 ml-2 text-2xl font-display text-textBlack">알림</h3>
      <div className="flex flex-col gap-3 mb-8 p-3 font-sans font-semibold w-full h-[50vh] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="p-3 rounded-lg text-sm text-textBlack shadow-md">
              {notification.content}
            </div>
          ))
        ) : (
          <div className="flex justify-center text-textBlack">
            알림이 없습니다.
          </div>
        )}
      </div>
      <div className='flex justify-end bottom-[10vh] pb-[10vh]'>
        <button
          className="w-[20%] py-2 bg-secondary text-white rounded-lg shadow-md cursor-pointer font-sans"
          onClick={handleClose}
        >
          <span className="text-md">닫기</span>
        </button>
      </div>
    </div>
  );
};

NotificationCard.propTypes = {
  onClose: PropTypes.func,
};

export default NotificationCard;
