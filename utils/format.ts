const DEFAULT_LOCALE = "pt-BR";

export function formatDate(
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
  locale: string = DEFAULT_LOCALE,
) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale: string = DEFAULT_LOCALE,
) {
  if (!Number.isFinite(value)) {
    return "";
  }

  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  currency = "BRL",
  locale: string = DEFAULT_LOCALE,
) {
  return formatNumber(value, { style: "currency", currency }, locale);
}

export function truncate(value: string, max: number) {
  if (value.length <= max) {
    return value;
  }

  const sliced = value.slice(0, max).trimEnd();
  const lastSpace = sliced.lastIndexOf(" ");

  return `${lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced}...`;
}
