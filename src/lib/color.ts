export function getContrastColor(hex?: string | null): string {
  const fallback = "#ffffff";
  if (!hex) return fallback;

  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return fallback;

  const [r, g, b] = match.slice(1).map((c) => parseInt(c, 16) / 255);
  const linear = [r, g, b].map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];

  return luminance > 0.55 ? "#0B0D12" : "#ffffff";
}

export function withDefaultBrandColor(hex?: string | null): string {
  return hex && /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#4F8CFF";
}
