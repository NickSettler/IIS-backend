/**
 * Check if two date ranges overlap
 * @param dates1 - Array of date ranges. E.g. [[start1, end1], [start2, end2], ...]
 * @param dates2 - Array of date ranges. E.g. [[start1, end1], [start2, end2], ...]
 * @returns true if any of the date ranges in dates1 overlap with any of the date ranges in dates2
 */
export const checkDatesOverlap = (
  dates1: Array<[Date, Date]>,
  dates2: Array<[Date, Date]>,
): boolean =>
  dates1.some(([start1, end1]) =>
    dates2.some(
      ([start2, end2]) =>
        (start1 >= start2 && start1 <= end2) ||
        (end1 >= start2 && end1 <= end2) ||
        (start2 >= start1 && start2 <= end1) ||
        (end2 >= start1 && end2 <= end1),
    ),
  );
