import { useContext } from 'react';
import NotificationContextValue from '../context/NotificationContextValue';

const useNotification = () => {
  const context = useContext(NotificationContextValue);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
};

export default useNotification;