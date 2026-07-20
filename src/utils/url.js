export function extractUrl(text) {
  if (!text) return '';
  const match = text.match(/https?:\/\/\S+/);
  if (match) return match[0];
  const trimmed = text.trim();
  if (!trimmed) return '';
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}
