export function calculateEntryHours(timeIn: string, timeOut: string): number {
  if (!timeIn || !timeOut) return 0;

  const [inHour, inMinute] = timeIn.split(":").map(Number);
  const [outHour, outMinute] = timeOut.split(":").map(Number);

  const inMinutes = inHour * 60 + inMinute;
  const outMinutes = outHour * 60 + outMinute;

  return Math.max(0, (outMinutes - inMinutes) / 60);
}
