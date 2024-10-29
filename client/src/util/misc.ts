export function getFormatedTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return String(min) + ":" + ((sec < 10 ? "0" : "") + String(sec));
}
