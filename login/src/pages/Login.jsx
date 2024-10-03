// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import useLogoutTimer from '../hooks/useLogoutTimer';
import Modal from '../components/Modal';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [accessToken, setAccessToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();
  const { login, logout, message, loading } = useLogin();
  const timeRemaining = useLogoutTimer(timeLeft, () => logout(setAccessToken, setTimeLeft));
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(formData, navigate, setAccessToken, setTimeLeft);
    setShowModal(true);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div>
      <h2>Login</h2>
      {!accessToken ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Correo:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Clave:</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Login'}
          </button>
        </form>
      ) : (
        <div>
          <h3>Tiempo restante del token: {timeRemaining !== null ? `${timeRemaining} segundos` : 'Calculando...'}</h3>
          <button onClick={() => logout(setAccessToken, setTimeLeft)}>Logout</button>
          <button onClick={() => handleNavigation('/seller/profile')}>Ver Perfil</button>
          <button onClick={() => handleNavigation('/seller/crudProduct')}>Crear Producto</button>
          <button onClick={() => handleNavigation('/seller/productList')}>Listado de Productos</button>
        </div>
      )}

      {message && (
        <Modal show={showModal} onClose={() => setShowModal(false)} title="Mensaje">
          <p>{message}</p>
        </Modal>
      )}
    </div>
  );
};

export default Login;
