function ProductList({ products, onEdit, onDelete }) {
  if (!products.length) {
    return <div>No hay productos disponibles.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div className="product-card" key={product._id || product.id}>
          <h3>{product.nombre}</h3>
          <p>Tipo: {product.tipo}</p>
          <p>Color: {product.color}</p>
          <p>Talla: {product.talla}</p>
          <p>Precio: ${product.precio}</p>
          {(onEdit || onDelete) && (
            <div className="card-actions">
              {onEdit && <button onClick={() => onEdit(product)}>Editar</button>}
              {onDelete && (
                <button className="delete-button" onClick={() => onDelete(product._id || product.id)}>
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
