import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    clave: '',
  });
  const [message, setMessage] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_BACK}api/auth/login`, formData);
      const { accessToken, primerLogin, id_usuario } = response.data;

      if (!accessToken) {
        throw new Error("No se recibió el accessToken");
      }


      // Almacenar el token en sessionStorage
      sessionStorage.setItem('accessToken', accessToken);

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
        startAutoLogoutTimer(timeResponse.data.timeLeft);
      }
    } catch (error) {
      setMessage('Login failed.');
      console.error('Error during login:', error.response?.data?.error || error.message);
    }
  };

  const startAutoLogoutTimer = (time) => {
    const timer = setTimeout(() => {
      handleLogout();
    }, time * 1000); 

    return () => clearTimeout(timer);
  };

  const handleLogout = () => {
    setAccessToken('');
    setTimeLeft(null);
    setMessage('Session expired. Please log in again.');
    sessionStorage.removeItem('accessToken'); // Remover el token del sessionStorage al cerrar sesión
  };

  const handleNavigateToProfile = () => {
    navigate('/seller/profile');
  }

  const handleNavigateToProduct = () => {
    navigate('/seller/crudProduct');
  }

  const handleNavigateToProductList = () => {
    navigate('/seller/productList');
  }

  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleLogout();
    }
  }, [timeLeft]);

  return (
    <div>
      <h2>Login</h2>
      {!accessToken ? (
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="correo">Correo:</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="clave">Clave:</label>
            <input
              id="clave"
              type="password"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <h3>Tiempo restante del token: {timeLeft !== null ? `${timeLeft} segundos` : 'Calculando...'}</h3>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleNavigateToProfile}>Ver Perfil</button>
          <button onClick={handleNavigateToProduct}>Crear Producto</button>
          <button onClick={handleNavigateToProductList}>Listado de Productos</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
