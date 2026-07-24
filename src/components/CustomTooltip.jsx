import { useLayoutEffect, useRef, useState } from "react";
import { formatAmount } from "../utils/common";

// 점(active dot)과 카드 사이 간격
const GAP = 12;

function CustomTooltip({ active, payload, label, viewBox }) {
  const cardRef = useRef(null);
  // 활성 점의 실제 좌표와 카드 크기
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!active) return;

    // recharts가 그린 활성 점(circle)의 정확한 좌표를 읽는다
    const dot = document.querySelector(".recharts-active-dot circle");
    const card = cardRef.current;
    if (!dot || !card) return;

    const dotX = Number(dot.getAttribute("cx"));
    const dotY = Number(dot.getAttribute("cy"));
    const { offsetWidth: cardW, offsetHeight: cardH } = card;

    // 차트 그리기 영역 경계 (점이 속한 svg의 실제 너비를 우측 경계로 사용)
    const svg = dot.ownerSVGElement;
    const areaTop = viewBox?.y ?? 0;
    const areaRight = svg ? svg.getBoundingClientRect().width : Infinity;

    // 기본: 점의 우측 위. 공간이 부족하면 반대로 뒤집는다.
    const placeLeft = dotX + GAP + cardW > areaRight;
    const placeBelow = dotY - GAP - cardH < areaTop;

    const left = placeLeft ? dotX - GAP - cardW : dotX + GAP;
    const top = placeBelow ? dotY + GAP : dotY - GAP - cardH;

    // 좌표가 바뀔 때만 갱신 (무한 렌더 방지)
    if (!pos || pos.left !== left || pos.top !== top) {
      setPos({ left, top });
    }
  });

  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      ref={cardRef}
      className="chart_tooltip"
      style={{
        position: "absolute",
        left: pos?.left ?? 0,
        top: pos?.top ?? 0,
        // 좌표 계산 전 첫 프레임에는 깜빡임을 막기 위해 숨김
        visibility: pos ? "visible" : "hidden",
      }}
    >
      <p className="chart_tooltip_date"
         style={{ color: "#D8D8D8", fontSize: "12px", marginTop: "4px" }}>{label}</p>
      <p className="chart_tooltip_amount"
         style={{ color: "#D8D8D8", fontSize: "12px", marginTop: "4px" }}>{formatAmount(payload[0].value)}</p>
    </div>
  );
}

export default CustomTooltip;
