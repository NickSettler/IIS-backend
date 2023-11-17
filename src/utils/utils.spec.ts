import * as dayjs from 'dayjs';
import { checkDatesOverlap } from './datetime/overlap';

describe('Utils', () => {
  describe('datetime', () => {
    describe('overlap', () => {
      describe('{1, 1}', () => {
        const dates1: Array<[Date, Date]> = [
          [
            dayjs('2023-01-01T08:00:00.000Z').toDate(),
            dayjs('2023-01-01T10:00:00.000Z').toDate(),
          ],
        ];
        const dates2: Array<[Date, Date]> = [
          [
            dayjs('2023-01-01T09:00:00.000Z').toDate(),
            dayjs('2023-01-01T11:00:00.000Z').toDate(),
          ],
        ];

        it('a - b', () => {
          expect(checkDatesOverlap(dates1, dates2)).toBe(true);
        });

        it('b - a', () => {
          expect(checkDatesOverlap(dates2, dates1)).toBe(true);
        });

        it('a - a', () => {
          expect(checkDatesOverlap(dates1, dates1)).toBe(true);
        });

        it('b - b', () => {
          expect(checkDatesOverlap(dates2, dates2)).toBe(true);
        });

        it('a - 0', () => {
          expect(checkDatesOverlap(dates1, [])).toBe(false);
        });

        it('0 - a', () => {
          expect(checkDatesOverlap([], dates1)).toBe(false);
        });

        it('b - 0', () => {
          expect(checkDatesOverlap(dates2, [])).toBe(false);
        });

        it('0 - b', () => {
          expect(checkDatesOverlap([], dates2)).toBe(false);
        });

        it('0 - 0', () => {
          expect(checkDatesOverlap([], [])).toBe(false);
        });
      });

      describe('{1, N}', () => {
        const dates1A: Array<[Date, Date]> = [
          [
            dayjs('2023-01-01T09:00:00.000Z').toDate(),
            dayjs('2023-01-01T11:00:00.000Z').toDate(),
          ],
        ];
        const dates1B: Array<[Date, Date]> = [
          [
            dayjs('2023-01-02T11:00:00.000Z').toDate(),
            dayjs('2023-01-02T13:00:00.000Z').toDate(),
          ],
        ];

        const dates2: Array<[Date, Date]> = [
          [
            dayjs('2023-01-01T08:00:00.000Z').toDate(),
            dayjs('2023-01-01T10:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-02T12:00:00.000Z').toDate(),
            dayjs('2023-01-02T14:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-03T08:00:00.000Z').toDate(),
            dayjs('2023-01-03T10:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-04T12:00:00.000Z').toDate(),
            dayjs('2023-01-04T14:00:00.000Z').toDate(),
          ],
        ];

        it('aA - b', () => {
          expect(checkDatesOverlap(dates1A, dates2)).toBe(true);
        });

        it('aB - b', () => {
          expect(checkDatesOverlap(dates1B, dates2)).toBe(true);
        });

        it('b - aA', () => {
          expect(checkDatesOverlap(dates2, dates1A)).toBe(true);
        });

        it('b - aB', () => {
          expect(checkDatesOverlap(dates2, dates1B)).toBe(true);
        });

        it('aA - aB', () => {
          expect(checkDatesOverlap(dates1A, dates1B)).toBe(false);
        });

        it('aB - aA', () => {
          expect(checkDatesOverlap(dates1B, dates1A)).toBe(false);
        });

        it('aA - aA', () => {
          expect(checkDatesOverlap(dates1A, dates1A)).toBe(true);
        });

        it('aB - aB', () => {
          expect(checkDatesOverlap(dates1B, dates1B)).toBe(true);
        });

        it('aA - 0', () => {
          expect(checkDatesOverlap(dates1A, [])).toBe(false);
        });

        it('aB - 0', () => {
          expect(checkDatesOverlap(dates1B, [])).toBe(false);
        });

        it('0 - aA', () => {
          expect(checkDatesOverlap([], dates1A)).toBe(false);
        });

        it('0 - aB', () => {
          expect(checkDatesOverlap([], dates1B)).toBe(false);
        });

        it('0 - 0', () => {
          expect(checkDatesOverlap([], [])).toBe(false);
        });
      });

      describe('{N, N}', () => {
        const dates1: Array<[Date, Date]> = [
          [
            dayjs('2023-01-01T08:00:00.000Z').toDate(),
            dayjs('2023-01-01T10:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-02T12:00:00.000Z').toDate(),
            dayjs('2023-01-02T14:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-03T08:00:00.000Z').toDate(),
            dayjs('2023-01-03T10:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-04T12:00:00.000Z').toDate(),
            dayjs('2023-01-04T14:00:00.000Z').toDate(),
          ],
        ];

        const dates2: Array<[Date, Date]> = [
          [
            dayjs('2023-01-01T07:00:00.000Z').toDate(),
            dayjs('2023-01-01T09:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-02T11:00:00.000Z').toDate(),
            dayjs('2023-01-02T13:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-03T09:00:00.000Z').toDate(),
            dayjs('2023-01-03T11:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-04T13:00:00.000Z').toDate(),
            dayjs('2023-01-04T15:00:00.000Z').toDate(),
          ],
        ];

        it('a - b', () => {
          expect(checkDatesOverlap(dates1, dates2)).toBe(true);
        });

        it('b - a', () => {
          expect(checkDatesOverlap(dates2, dates1)).toBe(true);
        });

        it('a - a', () => {
          expect(checkDatesOverlap(dates1, dates1)).toBe(true);
        });

        it('b - b', () => {
          expect(checkDatesOverlap(dates2, dates2)).toBe(true);
        });

        it('a - 0', () => {
          expect(checkDatesOverlap(dates1, [])).toBe(false);
        });

        it('0 - a', () => {
          expect(checkDatesOverlap([], dates1)).toBe(false);
        });

        it('b - 0', () => {
          expect(checkDatesOverlap(dates2, [])).toBe(false);
        });

        it('0 - b', () => {
          expect(checkDatesOverlap([], dates2)).toBe(false);
        });

        it('0 - 0', () => {
          expect(checkDatesOverlap([], [])).toBe(false);
        });
      });

      describe('{N, M}', () => {
        const dates1: Array<[Date, Date]> = [
          [
            dayjs('2023-01-01T08:00:00.000Z').toDate(),
            dayjs('2023-01-01T10:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-02T12:00:00.000Z').toDate(),
            dayjs('2023-01-02T14:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-03T08:00:00.000Z').toDate(),
            dayjs('2023-01-03T10:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-04T12:00:00.000Z').toDate(),
            dayjs('2023-01-04T14:00:00.000Z').toDate(),
          ],
        ];

        const dates2: Array<[Date, Date]> = [
          [
            dayjs('2023-01-01T07:00:00.000Z').toDate(),
            dayjs('2023-01-01T09:00:00.000Z').toDate(),
          ],
          [
            dayjs('2023-01-02T11:00:00.000Z').toDate(),
            dayjs('2023-01-02T13:00:00.000Z').toDate(),
          ],
        ];

        it('a - b', () => {
          expect(checkDatesOverlap(dates1, dates2)).toBe(true);
        });

        it('b - a', () => {
          expect(checkDatesOverlap(dates2, dates1)).toBe(true);
        });

        it('a - a', () => {
          expect(checkDatesOverlap(dates1, dates1)).toBe(true);
        });

        it('b - b', () => {
          expect(checkDatesOverlap(dates2, dates2)).toBe(true);
        });

        it('a - 0', () => {
          expect(checkDatesOverlap(dates1, [])).toBe(false);
        });

        it('0 - a', () => {
          expect(checkDatesOverlap([], dates1)).toBe(false);
        });

        it('b - 0', () => {
          expect(checkDatesOverlap(dates2, [])).toBe(false);
        });

        it('0 - b', () => {
          expect(checkDatesOverlap([], dates2)).toBe(false);
        });

        it('0 - 0', () => {
          expect(checkDatesOverlap([], [])).toBe(false);
        });
      });
    });
  });
});
