import noImage from "/src/assets/images/img_thm_noimg.png";

function LogoImg({ src, cNm = '' }) {

    return (
        <img src={src} alt={`${cNm} 기업 로고 이미지`} onError={(e) => {
            // 현재 요소에 등록된 onerror 이벤트를 제거
            e.currentTarget.onerror = null;
            // 현재 요소에 src 경로를 noImage로 변경
            e.currentTarget.src = noImage;
          }} />
    )
}

export default LogoImg  