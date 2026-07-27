import { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import "../assets/css/chart.css";



const data = [
  { date: "7/1", amount: 100000000 },
  { date: "7/5", amount: 250000000 },
  { date: "7/12", amount: 150000000 },
];

const groupInvestmentsByDate = (list = []) => {
  const groupedData = list.reduce((acc, investment) => {
    const createdAt = new Date(investment.createdAt);

    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1;
    const day = createdAt.getDate();

    // 정렬용 날짜 키
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (!acc[dateKey]) {
      acc[dateKey] = {
        dateKey,
        date: `${year}-${month}-${day}`,
        amount: 0,
      };
    }

    // API의 amount가 문자열이므로 숫자로 변환
    acc[dateKey].amount += Number(investment.amount);

    return acc;
  }, {});

  return Object.values(groupedData)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .map(({ dateKey, ...item }) => item);
};

function Chart({ dataList }) {

  const formmatteData = groupInvestmentsByDate(dataList);

  // 브러시로 선택한 구간 (초기값은 전체 범위)
  const [range, setRange] = useState({
    startIndex: 0,
    endIndex: Math.max(0, formmatteData.length - 1),
  });

  // Ctrl(또는 Cmd) + 마우스 휠로 커서 위치를 중심으로 줌 인/아웃
  const chartRef = useRef(null);
  const totalCount = formmatteData.length;

  useEffect(() => {
  setRange({
    startIndex: 0,
    endIndex: Math.max(0, totalCount - 1),
  });
}, [totalCount]);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    const handleWheelZoom = (event) => {
      // Ctrl/Cmd를 누르지 않은 일반 휠은 페이지 스크롤로 넘긴다
      if (!event.ctrlKey && !event.metaKey) return;
      // 브라우저 기본 확대를 막는다 (passive: false 여야 동작)
      event.preventDefault();

      const lastIndex = totalCount - 1;
      if (lastIndex < 1) return;

      setRange((prev) => {
        const span = prev.endIndex - prev.startIndex;

        // 커서의 가로 위치를 0~1 비율로 변환해 확대 중심으로 삼는다
        const rect = element.getBoundingClientRect();
        const ratio = Math.min(
          1,
          Math.max(0, (event.clientX - rect.left) / rect.width)
        );
        const focusIndex = prev.startIndex + span * ratio;

        // 휠을 올리면 확대(구간 좁힘), 내리면 축소(구간 넓힘)
        const zoomIn = event.deltaY < 0;
        const step = Math.max(1, Math.round(span * 0.2));
        const nextSpan = zoomIn
          ? Math.max(1, span - step)
          : Math.min(lastIndex, span + step);

        // 변화가 없으면 상태를 갱신하지 않는다
        if (nextSpan === span) return prev;

        // 확대 중심(focusIndex)을 유지하도록 새 구간의 시작/끝을 계산
        let nextStart = Math.round(focusIndex - nextSpan * ratio);
        let nextEnd = nextStart + nextSpan;

        // 경계 보정
        if (nextStart < 0) {
          nextStart = 0;
          nextEnd = nextSpan;
        }
        if (nextEnd > lastIndex) {
          nextEnd = lastIndex;
          nextStart = lastIndex - nextSpan;
        }

        return { startIndex: nextStart, endIndex: nextEnd };
      });
    };

    element.addEventListener("wheel", handleWheelZoom, { passive: false });
    return () => element.removeEventListener("wheel", handleWheelZoom);
  }, [totalCount]);

  // 선택된 구간만 잘라서 그린다 (X축 확대)
  const visibleData = formmatteData.slice(range.startIndex, range.endIndex + 1);

  // 보이는 구간의 값 범위에 맞춰 Y축을 재조정한다
  const EOK = 100_000_000;
  const amounts = visibleData.map((item) => item.amount);
  const visibleMax = amounts.length ? Math.max(...amounts) : 0;
  const visibleMin = amounts.length ? Math.min(...amounts) : 0;

  // 값들이 서로 가까우면(변동폭이 최댓값의 25% 미만) 0부터 그리지 않고
  // 최솟값 근처까지 축을 끌어올려 미세한 차이를 크게 보여준다.
  const spread = visibleMax - visibleMin;
  const isFlat = visibleMax > 0 && spread < visibleMax * 0.25;

  let yDomain = [0, "auto"];

  if (visibleMax > 0) {
    if (isFlat) {
      // 변동폭의 절반씩 위아래 여백을 두되, 최소 여백은 보장한다
      const padding = Math.max(spread * 0.5, visibleMax * 0.02);
      const lower = Math.max(0, Math.floor((visibleMin - padding) / EOK) * EOK);
      const upper = Math.ceil((visibleMax + padding) / EOK) * EOK;
      // 올림/내림으로 상·하한이 같아지는 경우를 방지
      yDomain = upper > lower ? [lower, upper] : [lower, lower + EOK];
    } else {
      yDomain = [0, Math.ceil((visibleMax * 1.1) / EOK) * EOK];
    }
  }

  return (
      <div className="overflow_x">
    <div className="chart_wrap">

        <div className="investment_chart" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visibleData} margin={{ top: 20, right: 15, bottom: 10, left: 10}}>
              <defs>
                <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--main_color)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--main_color)" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid className="investment_chart_grid" vertical={false} />

              <XAxis
                className="investment_chart_axis investment_chart_x_axis"
                tick={{
                  fill: "#b9b9b9",
                  fontSize: 15,
                }}
                dataKey="date"
                tickLine={false}
              />

              <YAxis
                className="investment_chart_axis"
                tickLine={false}
                tick={{
                  fill: "#ffff",
                  fontSize: 18,
                }}
                axisLine={false}
                domain={yDomain}
                tickFormatter={(value) =>
                  `${value / 100_000_000}억`
                }
              />

              <Tooltip
                content={<CustomTooltip />}
                isAnimationActive={false}
                position={{ x: 0, y: 0 }}
                wrapperStyle={{ pointerEvents: "none" }}
              />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--main_color)"
                strokeWidth={4}
                fill="url(#amountGradient)"
                fillOpacity={1}
                dot={{
                  r: 6,
                  fill: "var(--main_color)",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

export default Chart;