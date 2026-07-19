import React from "react";
import "./FormInput.css";

function FormInput({ label, type = "text", name, value, onChange, error, placeholder }) {
  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "form-input__field form-input__field--error" : "form-input__field"}
      />
      {error && <span className="form-input__error">{error}</span>}
    </div>
  );
}

export default FormInput;