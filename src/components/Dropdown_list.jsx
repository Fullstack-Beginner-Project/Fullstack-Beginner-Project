import "../assets/css/Dropdown_list.css";
import React, { useState } from "react";

function Dropdown_list({ size, onSelect }) {
  const className = ["dropdown_list", size].join(" ");
  const options = [
    "누적 투자금액 높은순",
    "누적 투자금액 낮은순",
    "매출액 높은순",
    "매출액 낮은순",
    "고용 인원 많은순",
    "고용 인원 적은순"
  ];

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
