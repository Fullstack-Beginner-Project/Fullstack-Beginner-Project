import "../assets/css/dropdown_list.css";
import React, { useState } from "react";

function Dropdown_list({ size, options, onSelect }) {
  const className = ["dropdown_list", size].join(" ");

  return (
    <ul className={className}>
      {options.map((option, idx) => (
        <li key={idx} onClick={() => onSelect(option)}>
          {option}
        </li>
      ))}
    </ul>
  );
}

export default Dropdown_list;
