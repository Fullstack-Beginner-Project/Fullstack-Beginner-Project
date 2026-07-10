import React from "react";
import "../assets/css/InputField.css";



// children으로 버튼, 안내 문구 등 다른 컴포넌트를 자유롭게 넣어서 사용하시면됩니다
function InputField({ variant = "filled", children }) {
  return (
    <div className={`input_field_wrap ${variant}`}>
      {children}
    </div>
  )
}



export default InputField;
