import { useState } from "react";
import {
  isFavoriteCompany,
  toggleFavoriteCompany,
} from "../utils/common";

import FilledHeartIcon from "../assets/images/icon_btn_filled_heart.png";
import EmptyHeartIcon from "../assets/images/icon_btn_empty_heart.png";

function FavoriteButton({ companyId }) {
  const [isFavorite, setIsFavorite] = useState(
    () => isFavoriteCompany(companyId)
  );

  const handleClick = (event) => {
    event.stopPropagation();

    if (!companyId) return;

    const updatedFavoriteCompanyIds = toggleFavoriteCompany(companyId);

    setIsFavorite(updatedFavoriteCompanyIds.includes(companyId));
  };

  return (
    <button
      type="button"
      className="favorite_btn"
      onClick={handleClick}
      aria-label={isFavorite ? "찜 해제" : "찜하기"}
    >
      <img
        src={isFavorite ? FilledHeartIcon : EmptyHeartIcon}
        alt=""
      />
    </button>
  );
}

export default FavoriteButton;