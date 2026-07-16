export function formatAmount(value) {
  const amount = Number(value);

  if (!amount) return "0원";
  if (amount >= 100_000_000) return `${Math.round(amount / 100_000_000).toLocaleString()}억 원`;
  if (amount >= 10_000_000) return `${Math.round(amount / 10_000_000).toLocaleString()}천만 원`;
  if (amount >= 1_000_000) return `${Math.round(amount / 1_000_000).toLocaleString()}백만 원`;

  return `${amount.toLocaleString()}원`;
};