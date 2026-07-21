import React, { useState } from "react";
import "../assets/css/input.css";
import visibilityIcon from "../assets/images/icon_visibility_on.png";
import nonvisibilityIcon from "../assets/images/icon_visibility_off.png";
/* 
  Input 컴포넌트입니다.
  type : [password, text] 타입 설정해주세요.
  placeholder : "" 내부 text 작성해주세요
  onValueChange : {} Form 작성을 위한 Value 값 내보내는 파라미터입니다.

  ex)
  <Input type={"text"} placeholder={"Test"} onValueChange={(value) => console.log(value)}/>
 */
function Input({ type, placeholder, onValueChange, initialValue = "", }) {
  const [first, setFirst] = useState(true);
  const [value, setValue] = useState(initialValue);
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
              src={visibilityIcon}
              alt="보이기"
              onClick={() => setVisible(true)}
            />
          ) : (
            <img
              src={nonvisibilityIcon}
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