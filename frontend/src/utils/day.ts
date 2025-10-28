import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format a date:
 * - "3 hours ago" (if within 24h)
 * - "Yesterday at 13:45"
 * - "May 15 at 13:45"
 *
 * @param isoString - the ISO timestamp string
 * @returns formatted string
 */
export function formatTime(isoString: string): string {
  const localTime = dayjs(isoString);

  const now = dayjs();

  const diffInHours = now.diff(localTime, "hour");
  const diffInDays = now.diff(localTime, "day");

  if (diffInHours < 24) {
    return localTime.fromNow(); // e.g. "3 hours ago"
  } else if (diffInDays === 1) {
    return `Yesterday at ${localTime.format("HH:mm")}`; // e.g. "Yesterday at 13:45"
  } else {
    return localTime.format("MMM D [at] HH:mm"); // e.g. "May 15 at 13:45"
  }
}
