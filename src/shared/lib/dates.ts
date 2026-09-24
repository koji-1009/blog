// Frontmatter dates have no time zone and are parsed as UTC midnight, so format them in UTC to keep the written day.
const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });
const monthDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });

/** "September 23, 2026" */
export function formatDate(date: Date): string {
  return fullDate.format(date);
}

/** "September 23" */
export function formatMonthDay(date: Date): string {
  return monthDay.format(date);
}

/** "2026-09-23", for the datetime attribute of <time>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
