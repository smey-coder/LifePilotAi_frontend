import { createContext } from 'react';

const NotificationContext = createContext({
  showNotification: (type, message, title) => {},
  showSuccess: (message, title) => {},
  showError: (message, title) => {},
  showInfo: (message, title) => {},
  showWarning: (message, title) => {},
});

export default NotificationContext;