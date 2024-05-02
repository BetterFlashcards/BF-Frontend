export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return "__/__/____";
  }
  return date.toLocaleString();
}

export function storeData<T>(key: string, data: T): void {
  const stringifiedData = JSON.stringify(data);
  localStorage.setItem(key, stringifiedData);
}
export function getLocalData<T>(key: string): T | null {
  const foundValue = localStorage.getItem(key);
  if (!foundValue) return null;
  return JSON.parse(foundValue);
}
