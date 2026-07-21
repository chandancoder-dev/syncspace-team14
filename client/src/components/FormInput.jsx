import React from "react";

function FormInput({ label, type = "text", name, value, onChange, error, placeholder }) {
  return (
    <div className="flex flex-col mb-5 text-left">
      <label htmlFor={name} className="text-sm font-semibold text-heading mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-3 rounded-lg text-sm bg-field text-heading border outline-none transition
          placeholder:text-paragraph
          ${error
            ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/30"
          }`}
      />
      {error && <span className="mt-1 text-xs text-red-400">{error}</span>}
    </div>
  );
}

export default FormInput;