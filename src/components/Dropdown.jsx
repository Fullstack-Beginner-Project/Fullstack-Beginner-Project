import "../assets/css/Dropdown.css";
import React, { useState } from "react";
import Dropdown_list from "./Dropdown_list";
/* 
  Dropdown 컴포넌트입니다.
  size : [medium, small] 타입 설정해주세요.
  options : {[]} Dropdown_list의 options를 위한 파라미터입니다. 배열을 넣어주세요.
  onChange : {} Form 작성을 위한 Value 값 내보내는 파라미터입니다.

  ex)
  <Dropdown size={"medium"} options={[1, 2, 3]} onChange={(value) => console.log(value)}/>
 */
function Dropdown({ size, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const className = ["dropdown_wrap", size].join(" ");

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <>
      <div className={className}>
        <div className="frame" onClick={() => setOpen(!open)}>
          <p>{selected || "선택하세요"}</p>
          <img src="./src/assets/images/icon_toggle.png" alt="토글" />
        </div>
        {open && (
          <Dropdown_list size={size} options={options} onSelect={handleSelect} />
        )}
      </div>
    </>
  );
}

export default Dropdown;
