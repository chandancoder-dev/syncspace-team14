import React, { useState } from "react";

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginTop: "8px",
    borderRadius: "8px",
    border: error
      ? "1.5px solid #DC2626"
      : isFocused
      ? "1.5px solid #2563EB"
      : "1px solid #DBEAFE",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    boxShadow: error
      ? "0 0 0 3px rgba(220, 38, 38, 0.10)"
      : isFocused
      ? "0 0 0 3px rgba(37, 99, 235, 0.12)"
      : "none",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            color: "#475569",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {error && (
        <p
          style={{
            color: "#DC2626",
            fontSize: "13px",
            marginTop: "5px",
            marginBottom: "0",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;