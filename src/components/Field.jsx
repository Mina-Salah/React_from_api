export default function Field({ label, id, children }) {
  return (
    <label htmlFor={id} className="text-sm block">
      <div className="mb-1">{label}</div>
      {children}
    </label>
  );
}
