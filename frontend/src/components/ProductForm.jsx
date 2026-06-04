function ProductForm({ formValues, onChange, onSubmit, onCancel, isEditing }) {
  return (
    <div className="admin-card">
      <h2>{isEditing ? 'Editar producto' : 'Crear producto'}</h2>
      <form onSubmit={onSubmit} className="product-form">
        <div className="field-group">
          <label>Nombre</label>
          <input name="nombre" value={formValues.nombre} onChange={onChange} required />
        </div>
        <div className="field-group">
          <label>Color</label>
          <input name="color" value={formValues.color} onChange={onChange} required />
        </div>
        <div className="field-group">
          <label>Talla</label>
          <input name="talla" value={formValues.talla} onChange={onChange} required />
        </div>
        <div className="field-group">
          <label>Tipo</label>
          <select name="tipo" value={formValues.tipo} onChange={onChange} required>
            <option value="">Selecciona tipo</option>
            <option value="zapato">Zapato</option>
            <option value="bolsa">Bolsa</option>
          </select>
        </div>
        <div className="field-group">
          <label>Precio</label>
          <input
            type="number"
            min="1"
            name="precio"
            value={formValues.precio}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">{isEditing ? 'Guardar cambios' : 'Crear producto'}</button>
          {isEditing && (
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
