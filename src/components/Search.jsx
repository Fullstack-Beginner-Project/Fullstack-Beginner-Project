import '../assets/css/search.css';
import React, { useState } from 'react';

function Search({ size, onSubmit }) {
  const className = ["search_wrap", size].join(" ");
  const [value, setValue] = useState("");

  const handleDelete = () => {
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value !== "") {
      onSubmit?.(value); // 부모로 값 전달
      console.log(value);
    }
  };

  const handleSearchClick = () => {
    if (value !== ""){
      onSubmit?.(value); // 검색 아이콘 클릭 시 값 전달
    }
  };

  return (
    <div className={className}>
      <div className={`frame ${value ? "has-value" : ""}`}>
        <div className="icon_wrap">
          {value && (
            <img
              src="./src/assets/images/icon_delete_circle_small.png"
              alt="삭제"
              className="delete_icon"
              onClick={handleDelete}
            />
          )}
          <img
            src="./src/assets/images/icon_search.png"
            alt="검색"
            className="search_icon"
            onClick={handleSearchClick}
          />
        </div>
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          className="search_input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default Search;