import React from "react";
import "../assets/css/InputField.css";

function InputField({ variant = "filled", children }) {
  return (
    <div className={`input_field_wrap ${variant}`}>
      {children}
    </div>
  )
}

export default InputField;
