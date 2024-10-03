// src/hooks/useLogin.js
import { useState } from 'react';
import axios from 'axios';
import { saveAccessToken, removeAccessToken } from '../services/sessionService';
import { handleLoginError } from '../utils/handleError';

const useLogin = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Estado de carga

  const login = async (formData, navigate, setAccessToken, setTimeLeft) => {
    setLoading(true);  // Inicia la carga
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_BACK}api/auth/login`, formData);
      const { accessToken, primerLogin, id_usuario } = response.data;

      if (!accessToken) {
        throw new Error("No se recibió el accessToken");
      }

      saveAccessToken(accessToken);
      setAccessToken(accessToken);
      setMessage('Login successful!');

      if (primerLogin) {
        navigate('/completa-perfil', { state: { accessToken, id_usuario } });
      } else {
        const timeResponse = await axios.get(`${process.env.REACT_APP_URL_BACK}api/auth/left-time`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTimeLeft(timeResponse.data.timeLeft);
      }
    } catch (error) {
      const errorMessage = handleLoginError(error);
      setMessage(errorMessage);
    } finally {
      setLoading(false);  // Finaliza la carga
    }
  };

  const logout = (setAccessToken, setTimeLeft) => {
    setAccessToken('');
    setTimeLeft(null);
    setMessage('Session expired. Please log in again.');
    removeAccessToken();
  };

  return { login, logout, message, loading };
};

export default useLogin;
