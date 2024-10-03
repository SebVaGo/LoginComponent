# Práctica 4
En el archivo codigoBaseCorregido.jsx se encuentra el componente sobre el cual se hizo la refactorización, este componente login es un componente de pruebas con la conexión y funcionamiento correcto con el Servidor, a su vez parte del módulo Login de un E-commerce en desarrollo. 

#Presencia de bugs, code smells y vulnerabilities dentro del código base: 
1. Presencia de code smells:
   -Código duplicado en el manejo de la navegación.
   -Uso de funciones anónimas dentro de la parte HTML del componente, se crea una nueva función cada que se renderiza el componente.
   -Dependencia de axios dentro del componente principal.
   -Código con exceso de responsabilidades.
   -Uso de e en lugar de event.
2. Posibles bugs
  -Falta de validación de compatibilidad con sessionStorage.
  -Falta de manejo de errores en el temporizador.
3. Vulnerabilidades
   -Almacenamiento inseguro de los JWT en sessionStorag.
   -Exposición de errores internos en el cliente
   

#Describir por lo menos 3 correcciones o refactorizaciones implementadas en su proyecto: Violación + Corrección/Refactorización + Fragmento de Código.
Me basé en AirBnbStyleGuide para la refactorización con el uso de buenas prácticas en el lenguaje JavaScript, a continuación los detalles de los cambios en los fragmentos de código:

1. Violación en el nombramiento de variables, cambio de español a inglés.
   1.1 Antes:
     const [formData, setFormData] = useState({
      correo: '',
      clave: '',
    });
   1.2 Después:
   const [formData, setFormData] = useState({
     email: '', // Cambia correo a email
     password: '', // Cambia clave a password
  });
2. Responsabilidad única con el almacenamiento de sessionStorage, creación de un servicio que maneje los estados de la sesión. Se hizo la separación para mantener la lógica fuera del componente
   2.1 Antes: El manejo de sesiones estaba incluido dentro del componente directamente
         sessionStorage.setItem('accessToken', accessToken);

        setAccessToken(accessToken);
   2.2 Después: Creación de un servicio dedicado para el manejo de las sesiones
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
3. Uso de un custom hook para el manejo de la lógica del Login, creación de un hook personalizado para el manejo de login
   3.1 Antes: La lógica estaba incluida dentro del componente, lo cual era incorrecto al contener lógica de negocio
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
   3.2 Después: Implementación de un hook que se encargue de esto
   // src/hooks/useLogin.js
  import { useState } from 'react';
  import axios from 'axios';
  import { saveAccessToken, removeAccessToken } from '../services/sessionService';
  
  const useLogin = () => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [message, setMessage] = useState('');
  
    const login = async (formData, navigate) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL_BACK}api/auth/login`, formData);
        const { accessToken, primerLogin, id_usuario } = response.data;
  
        if (!accessToken) {
          throw new Error("No se recibió el accessToken");
        }
  
        saveAccessToken(accessToken);
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
        setMessage('Login failed.');
        console.error('Error during login:', error.response?.data?.error || error.message);
      }
    };
  
    return { login, timeLeft, message };
  };
  
  export default useLogin;

  Ejemplo de uso: Dentro del componente Login solo se llama al custom hook para que se encargue de la lógica, de esta manera el componente se mantiene "limpio"
    const handleSubmit = async (e) => {
      e.preventDefault();
      await login(formData, navigate);
    };
