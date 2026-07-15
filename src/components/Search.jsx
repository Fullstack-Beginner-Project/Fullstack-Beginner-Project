import '../assets/css/search.css';
import React, { useState } from 'react';
/* 
  Search 컴포넌트입니다.
  size : [medium, small] 타입 설정해주세요. 페이지용은 적지 않습니다.
  페이지용은 반응형 구현을 위해 요소를 100%로 두고 max를 지정해두었습니다.
  필요하시면 페이지 css에서 덮어씌우는식으로 하시면 될것 같습니다.
  onSubmit : {} Form 작성을 위한 Value 값 내보내는 파라미터입니다.

  ex)
  <Dropdown size={"medium"} onSubmit={(value) => console.log(value)}/>
 */
function Search({ size, onSubmit }) {
  const className = ["search_wrap", size].join(" ");
  const [value, setValue] = useState("");

  const handleDelete = () => {
    setValue("");
    onSubmit?.("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (value !== "") {
        onSubmit?.(value);
      } else {
        onSubmit?.(""); // 빈 값이면 초기화
      }
    }
  };

  const handleSearchClick = () => {
    if (value !== "") {
      onSubmit?.(value);
    } else {
      onSubmit?.("");
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