import { getCompanyLogo, noImage } from "../utils/companyLogos.js";

function LogoImg({ cId, cNm = '' }) {
    const tdImage = getCompanyLogo(cId);

    return (
        <img src={tdImage} alt={`${cNm} 기업 로고 이미지`} onError={(e) => {
            // 현재 요소에 등록된 onerror 이벤트를 제거
            e.currentTarget.onerror = null;
            // 현재 요소에 src 경로를 noImage로 변경
            e.currentTarget.src = noImage;
          }} />
    )
}

export default LogoImg;