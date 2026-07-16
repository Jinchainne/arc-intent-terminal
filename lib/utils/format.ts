export function formatCurrency(value: number, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatAddress(address: string) {
  if (!address || address.length < 12) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTokenBalance(value: string, decimals = 2) {
  if (!value) {
    return "0.00";
  }

  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed) && trimmed.length > 12) {
    const whole = trimmed.length > 18 ? trimmed.slice(0, -18) : "0";
    const fraction = trimmed.padStart(19, "0").slice(-18).replace(/0+$/, "");
    const normalized = fraction ? `${whole}.${fraction}` : whole;
    const numeric = Number(normalized);
    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(numeric);
    }
  }

  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) {
    return trimmed;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(numeric);
}
