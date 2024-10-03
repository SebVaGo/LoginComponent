export const handleLoginError = (error) => {
    if (error.response) {
        if (error.response.data && error.response.data.error) {
            return 'Error: ' + error.response.data.error;
        }
        return 'Ocurrio un error inesperado';
    }
    return 'No se puede conectar con el servidor';
};