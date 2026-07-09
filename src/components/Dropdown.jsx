import "../assets/css/Dropdown.css";
import React, { useState } from "react";
import Dropdown_list from "./Dropdown_list";

function Dropdown({ size, onChange }) {
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
          <Dropdown_list size={size} onSelect={handleSelect} />
        )}
      </div>
    </>
  );
}

export default Dropdown;
