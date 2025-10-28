// src/components/common/Field.jsx
export default function Field({ label, id, children, required = false }) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {children}
    </div>
  );
}
