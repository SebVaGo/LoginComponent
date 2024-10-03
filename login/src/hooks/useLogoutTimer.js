// src/hooks/useLogoutTimer.js
import { useState, useEffect } from 'react';

const useLogoutTimer = (initialTime, handleLogout) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const decrementTime = () => {
    setTimeLeft(timeLeft - 1);
  };

  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const timer = setTimeout(decrementTime, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleLogout();
    }
  }, [timeLeft, handleLogout]);

  return timeLeft;
};

export default useLogoutTimer;
