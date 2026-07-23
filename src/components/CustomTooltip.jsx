import { formatAmount } from "../utils/common";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="chart_tooltip">
      <p className="chart_tooltip_date">{label}</p>
      <p className="chart_tooltip_amount">{formatAmount(payload[0].value)}</p>
    </div>
  );
}

export default CustomTooltip;
