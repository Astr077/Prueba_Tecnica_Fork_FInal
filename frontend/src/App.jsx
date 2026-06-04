import { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  adminCreateUser,
  deleteUser,
} from './services/productService.js';
import ProductList from './components/ProductList.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import ProductForm from './components/ProductForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import Login from './components/Login.jsx';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('catalogo-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState(() => localStorage.getItem('catalogo-search') || '');
  const [tipo, setTipo] = useState(() => localStorage.getItem('catalogo-tipo') || '');
  const [minPrecio, setMinPrecio] = useState(() => localStorage.getItem('catalogo-min-precio') || '');
  const [maxPrecio, setMaxPrecio] = useState(() => localStorage.getItem('catalogo-max-precio') || '');
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    color: '',
    talla: '',
    tipo: '',
    precio: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('catalogo-dark-mode');
    return stored ? JSON.parse(stored) : false;
  });

  // Estados para la Gestión de Usuarios
  const [activeTab, setActiveTab] = useState('catalogo'); // 'catalogo' o 'usuarios'
  const [users, setUsers] = useState([]);
  const [userFormValues, setUserFormValues] = useState({
    username: '',
    password: '',
    role: 'user',
  });
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [userSuccess, setUserSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      cargarProductos({ search, tipo, minPrecio, maxPrecio });
      cargarTodosLosProductos();
      if (user.role === 'admin') {
        cargarUsuarios();
      }
    }
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('catalogo-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('catalogo-search', search);
    localStorage.setItem('catalogo-tipo', tipo);
    localStorage.setItem('catalogo-min-precio', minPrecio);
    localStorage.setItem('catalogo-max-precio', maxPrecio);
  }, [search, tipo, minPrecio, maxPrecio]);

  async function cargarProductos(filters) {
    try {
      const response = await getProducts(filters);
      setProducts(response.data?.data || []);
      setError(null);
    } catch (err) {
      console.error('Error cargando productos:', err);
      if (err?.response?.status === 401) {
        handleLogout();
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'No se pudo cargar la lista de productos.'
        );
      }
    }
  }

  async function cargarTodosLosProductos() {
    try {
      const response = await getProducts({});
      setAllProducts(response.data?.data || []);
    } catch (err) {
      console.error('Error cargando inventario completo:', err);
    }
  }

  async function cargarUsuarios() {
    try {
      const response = await getUsers();
      setUsers(response.data?.data || []);
      setUserError(null);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setUserError(
        err?.response?.data?.message ||
        err?.message ||
        'No se pudo cargar la lista de usuarios.'
      );
    }
  }

  function handleLoginSuccess(userData, token) {
    localStorage.setItem('catalogo-token', token);
    localStorage.setItem('catalogo-user', JSON.stringify(userData));
    setUser(userData);
    setError(null);
  }

  function handleLogout() {
    localStorage.removeItem('catalogo-token');
    localStorage.removeItem('catalogo-user');
    setUser(null);
    setProducts([]);
    setAllProducts([]);
    setUsers([]);
    setActiveTab('catalogo');
    setUserError(null);
    setUserSuccess(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (user?.role !== 'admin') {
      setError('Solo los administradores pueden realizar esta acción.');
      return;
    }

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct, {
          ...formValues,
          precio: Number(formValues.precio),
        });
      } else {
        await createProduct({
          ...formValues,
          precio: Number(formValues.precio),
        });
      }
      setFormValues({ nombre: '', color: '', talla: '', tipo: '', precio: '' });
      setSelectedProduct(null);
      cargarProductos({ search, tipo, minPrecio, maxPrecio });
      cargarTodosLosProductos();
      setError(null);
    } catch (err) {
      console.error('Error guardando producto:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo guardar el producto.'
      );
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function handleUserInputChange(event) {
    const { name, value } = event.target;
    setUserFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    if (user?.role !== 'admin') {
      setUserError('Solo los administradores pueden realizar esta acción.');
      return;
    }
    setUserLoading(true);
    setUserError(null);
    setUserSuccess(null);

    try {
      await adminCreateUser(userFormValues);
      setUserSuccess(`¡Usuario "${userFormValues.username}" creado exitosamente!`);
      setUserFormValues({ username: '', password: '', role: 'user' });
      cargarUsuarios();
    } catch (err) {
      console.error('Error al crear usuario:', err);
      setUserError(
        err?.response?.data?.message ||
        err?.message ||
        'No se pudo crear el usuario.'
      );
    } finally {
      setUserLoading(false);
    }
  }

  async function handleDeleteUser(userId) {
    if (user?.role !== 'admin') {
      setUserError('Solo los administradores pueden eliminar usuarios.');
      return;
    }
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmar) return;

    setUserLoading(true);
    setUserError(null);
    setUserSuccess(null);

    try {
      await deleteUser(userId);
      setUserSuccess('Usuario eliminado correctamente.');
      cargarUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setUserError(
        err?.response?.data?.message ||
        err?.message ||
        'No se pudo eliminar al usuario.'
      );
    } finally {
      setUserLoading(false);
    }
  }

  function handleEdit(product) {
    if (user?.role !== 'admin') return;
    setSelectedProduct(product._id || product.id);
    setFormValues({
      nombre: product.nombre || '',
      color: product.color || '',
      talla: product.talla || '',
      tipo: product.tipo || '',
      precio: product.precio || '',
    });
    setError(null);
  }

  async function handleDelete(id) {
    if (user?.role !== 'admin') {
      setError('Solo los administradores pueden eliminar productos.');
      return;
    }

    const confirmar = window.confirm('¿Eliminar este producto?');
    if (!confirmar) return;

    try {
      await deleteProduct(id);
      cargarProductos({ search, tipo, minPrecio, maxPrecio });
      cargarTodosLosProductos();
      setError(null);
    } catch (err) {
      console.error('Error eliminando producto:', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo eliminar el producto.'
      );
    }
  }

  function handleCancelEdit() {
    setSelectedProduct(null);
    setFormValues({ nombre: '', color: '', talla: '', tipo: '', precio: '' });
    setError(null);
  }

  function handleSearch(value) {
    setSearch(value);
    if (user) {
      cargarProductos({ search: value, tipo, minPrecio, maxPrecio });
    }
  }

  function handleFilter(values) {
    setTipo(values.tipo);
    setMinPrecio(values.minPrecio);
    setMaxPrecio(values.maxPrecio);
    if (user) {
      cargarProductos({ ...values, search });
    }
  }

  const totalProductos = allProducts.length;
  const totalZapatos = allProducts.filter((item) => item.tipo === 'zapato').length;
  const totalBolsas = allProducts.filter((item) => item.tipo === 'bolsa').length;
  const resultadosFiltrados = products.length;

  if (!user) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>Catálogo de Zapatos y Bolsas</h1>
          </div>
          <button className="mode-toggle" onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </header>
        {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Catálogo de Zapatos y Bolsas</h1>
        </div>
        <div className="user-widget">
          <span>Hola, <strong>{user.username}</strong></span>
          <span className={`role-badge ${user.role}`}>
            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
          </span>
          <button className="secondary-button" onClick={handleLogout} style={{ marginLeft: '0.5rem' }}>
            Cerrar sesión
          </button>
          <button className="mode-toggle" onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </div>
      </header>

      {user?.role === 'admin' && (
        <div className="admin-tabs-container">
          <div className="admin-tabs">
            <button
              className={`tab-button ${activeTab === 'catalogo' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('catalogo');
                setUserError(null);
                setUserSuccess(null);
              }}
            >
              Catálogo de Productos
            </button>
            <button
              className={`tab-button ${activeTab === 'usuarios' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('usuarios');
                cargarUsuarios();
              }}
            >
              Gestión de Usuarios
            </button>
          </div>
        </div>
      )}

      {activeTab === 'catalogo' ? (
        <>
          <Dashboard total={totalProductos} zapatos={totalZapatos} bolsas={totalBolsas} />

          <div className="toolbar">
            <SearchBar value={search} onChange={handleSearch} />
            <FilterPanel
              onChange={handleFilter}
              tipo={tipo}
              minPrecio={minPrecio}
              maxPrecio={maxPrecio}
            />
          </div>

          <div className="filter-summary-card">
            <span>Resultados del filtro:</span>
            <strong>{resultadosFiltrados}</strong>
          </div>

          {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

          <section className={user.role === 'admin' ? 'admin-grid' : 'product-list-only'}>
            {user.role === 'admin' && (
              <ProductForm
                formValues={formValues}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
                isEditing={Boolean(selectedProduct)}
              />
            )}
            <div className="product-list-card">
              <div className="section-header">
                <h2>Listado de productos</h2>
                <button className="secondary-button" onClick={() => handleFilter({ tipo: '', minPrecio: '', maxPrecio: '' })}>
                  Limpiar filtros
                </button>
              </div>
              <ProductList
                products={products}
                onEdit={user.role === 'admin' ? handleEdit : undefined}
                onDelete={user.role === 'admin' ? handleDelete : undefined}
              />
            </div>
          </section>
        </>
      ) : (
        activeTab === 'usuarios' && user?.role === 'admin' && (
          <div className="user-management-section">
            <div className="section-header">
              <h2>Gestión de Usuarios del Sistema</h2>
              <p style={{ margin: '0.25rem 0 1.5rem', color: 'var(--text-secondary)' }}>
                Crea nuevas cuentas de administradores y gestiona los accesos del personal.
              </p>
            </div>

            {userError && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{userError}</div>}
            {userSuccess && <div className="success-message" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#e6fffa', color: '#047857', borderRadius: '8px', borderLeft: '4px solid #34d399' }}>{userSuccess}</div>}

            <div className="admin-grid">
              <div className="form-card">
                <h3>Crear Nuevo Usuario</h3>
                <form onSubmit={handleCreateUser} className="product-form" style={{ marginTop: '1rem' }}>
                  <div className="field-group">
                    <label htmlFor="mgmt-username">Nombre de usuario</label>
                    <input
                      id="mgmt-username"
                      type="text"
                      name="username"
                      value={userFormValues.username}
                      onChange={handleUserInputChange}
                      placeholder="Ej. admin2, vendedor"
                      required
                      disabled={userLoading}
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="mgmt-password">Contraseña</label>
                    <input
                      id="mgmt-password"
                      type="password"
                      name="password"
                      value={userFormValues.password}
                      onChange={handleUserInputChange}
                      placeholder="Mínimo 6 caracteres"
                      required
                      disabled={userLoading}
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="mgmt-role">Rol de Usuario</label>
                    <select
                      id="mgmt-role"
                      name="role"
                      value={userFormValues.role}
                      onChange={handleUserInputChange}
                      disabled={userLoading}
                    >
                      <option value="user">Usuario Común (Lectura)</option>
                      <option value="admin">Administrador (Control Total)</option>
                    </select>
                  </div>

                  <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                    <button type="submit" disabled={userLoading} style={{ width: '100%' }}>
                      {userLoading ? 'Creando...' : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="product-list-card">
                <h3>Usuarios Registrados</h3>
                <div className="users-table-wrapper" style={{ marginTop: '1rem', overflowX: 'auto' }}>
                  <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color, #e0e0e0)', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Nombre de Usuario</th>
                        <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Rol</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => {
                        const isSelf = u.id === user.id || u._id === user.id;
                        const isSuperAdmin = u.username === 'admin';
                        return (
                          <tr key={u.id || u._id} style={{ borderBottom: '1px solid var(--border-color, #f0f0f0)' }}>
                            <td style={{ padding: '0.75rem' }}>
                              <strong style={{ color: 'var(--text-primary)' }}>{u.username}</strong>
                              {isSelf && <span className="role-badge user" style={{ marginLeft: '0.5rem', fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>Tú</span>}
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                              <span className={`role-badge ${u.role}`} style={{ fontSize: '0.7rem' }}>
                                {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                              <button
                                className="delete-button"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', opacity: (isSelf || isSuperAdmin) ? 0.4 : 1, cursor: (isSelf || isSuperAdmin) ? 'not-allowed' : 'pointer' }}
                                disabled={isSelf || isSuperAdmin}
                                onClick={() => handleDeleteUser(u.id || u._id)}
                                title={isSelf ? 'No puedes borrarte a ti mismo' : isSuperAdmin ? 'No se puede eliminar al admin principal' : 'Eliminar usuario'}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default App;
