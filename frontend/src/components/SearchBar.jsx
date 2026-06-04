function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar producto..."
      style={{ padding: '0.9rem', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }}
    />
  );
}

export default SearchBar;
