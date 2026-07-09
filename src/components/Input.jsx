import React, { useState } from "react";
import "../assets/css/Input.css";

function Input({ type, placeholder, onValueChange }) {
  const [first, setFirst] = useState(true);
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);

  const handleChange = (e) => { // 부모로 값 보내기
    setValue(e.target.value);
    onValueChange?.(e.target.value);
  };

  return (
    <div className="input_wrap">
      <div className="frame">
        <input
          type={type === "password" ? (visible ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setFirst(false)}
        />
        {type === "password" && (
          !visible ? (
            <img
              src="./src/assets/images/icon_visibility_on.png"
              alt="보이기"
              onClick={() => setVisible(true)}
            />
          ) : (
            <img
              src="./src/assets/images/icon_visibility_off.png"
              alt="숨기기"
              onClick={() => setVisible(false)}
            />
          )
        )}
      </div>
      {!first && value === "" && (
        <p className="warning_message">* 필수 입력사항입니다.</p>
      )}
    </div>
  )
}

export default Input;