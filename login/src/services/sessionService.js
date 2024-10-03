// src/services/sessionService.js
export const saveAccessToken = (token) => {
    sessionStorage.setItem('accessToken', token);
  };
  
  export const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
  };
  
  export const removeAccessToken = () => {
    sessionStorage.removeItem('accessToken');
  };
  