export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return "__/__/____";
  }
  return date.toLocaleString();
}
