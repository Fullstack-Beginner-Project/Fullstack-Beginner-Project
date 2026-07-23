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

  return (
      <div className="overflow_x">
    <div className="chart_wrap">

        <div className="investment_chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formmatteData} margin={{ top: 20, right: 15, bottom: 10, left: 10}}>
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