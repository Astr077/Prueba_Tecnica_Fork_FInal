import { useEffect, useState } from 'react';

function FilterPanel({ onChange, tipo, minPrecio, maxPrecio }) {
  const [values, setValues] = useState({ tipo, minPrecio, maxPrecio });

  useEffect(() => {
    setValues({ tipo, minPrecio, maxPrecio });
  }, [tipo, minPrecio, maxPrecio]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onChange(values);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="filter-panel" style={{ display: 'grid', gap: '0.75rem' }}>
      <select
        name="tipo"
        value={values.tipo}
        onChange={handleInputChange}
        style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ccc' }}
      >
        <option value="">Todos los tipos</option>
        <option value="zapato">Zapato</option>
        <option value="bolsa">Bolsa</option>
      </select>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <input
          type="number"
          name="minPrecio"
          value={values.minPrecio}
          onChange={handleInputChange}
          placeholder="Precio mínimo"
          style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          name="maxPrecio"
          value={values.maxPrecio}
          onChange={handleInputChange}
          placeholder="Precio máximo"
          style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>
      <button type="submit" style={{ padding: '0.9rem', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', cursor: 'pointer' }}>
        Aplicar filtros
      </button>
    </form>
  );
}

export default FilterPanel;
