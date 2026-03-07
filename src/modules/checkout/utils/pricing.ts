export function formatCurrency(
  amount: number,
  currency = "EUR",
  locale = "hr-HR",
) {
  const normalizedCurrency = currency.toUpperCase();

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: normalizedCurrency,
    }).format(amount);
  } catch {
    return `${amount} ${normalizedCurrency}`;
  }
}

export function getRangeTotalDays(from: Date, to: Date) {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  const diffMs = end.getTime() - start.getTime();
  const dayMs = 1000 * 60 * 60 * 24;

  return Math.floor(diffMs / dayMs) + 1;
}

export function calculateRangeTotal(
  pricePerDay: number,
  from: Date,
  to: Date,
) {
  return pricePerDay * getRangeTotalDays(from, to);
}

export function getBillingPeriodLabel(period: string) {
  switch (period) {
    case "hour":
      return "sat";
    case "day":
      return "dan";
    case "week":
      return "tjedan";
    case "month":
      return "mjesec";
    case "year":
      return "godina";
    default:
      return period;
  }
}
