import { useState } from 'react';
import { login, register } from '../services/productService.js';

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, password);
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setIsRegister(false);
        setPassword('');
      } else {
        const response = await login(username, password);
        const { user, token } = response.data.data;
        onLoginSuccess(user, token);
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Ocurrió un error en la autenticación.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>{isRegister ? 'Crear una Cuenta' : 'Iniciar Sesión'}</h2>
          <p className="login-subtitle">
            {isRegister 
              ? 'Regístrate para ver el catálogo de productos' 
              : 'Accede con tus credenciales de administrador o usuario'}
          </p>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="success-message" style={{ marginBottom: '1rem', padding: '1rem', background: '#e6fffa', color: '#047857', borderRadius: '8px' }}>{success}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="field-group">
            <label htmlFor="login-username">Nombre de usuario</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. admin, user"
              required
              disabled={loading}
            />
          </div>

          <div className="field-group">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading 
                ? 'Cargando...' 
                : isRegister 
                  ? 'Registrarse' 
                  : 'Ingresar'}
            </button>
          </div>
        </form>

        <div className="login-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
            className="secondary-button"
            style={{ background: 'transparent', color: '#4f46e5', border: 'none', fontWeight: '600' }}
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
              setSuccess(null);
              setUsername('');
              setPassword('');
            }}
          >
            {isRegister 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿No tienes una cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
