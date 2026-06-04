function Dashboard({ total, zapatos, bolsas }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-item">
        <span className="dashboard-value">{total}</span>
        <span>Total de productos</span>
      </div>
      <div className="dashboard-item">
        <span className="dashboard-value">{zapatos}</span>
        <span>Zapatos</span>
      </div>
      <div className="dashboard-item">
        <span className="dashboard-value">{bolsas}</span>
        <span>Bolsas</span>
      </div>
    </div>
  );
}

export default Dashboard;
