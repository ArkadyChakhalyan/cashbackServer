import { getIsCashbackExpired } from './getIsCashbackExpired';

describe('getIsCashbackExpired', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // Set current time to 2024-03-15 (middle of March 2024)
        jest.setSystemTime(new Date('2024-03-15T12:00:00.000Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('returns true for timestamp in the previous month', () => {
        const lastMonth = new Date('2024-02-20T10:00:00.000Z');
        expect(getIsCashbackExpired(lastMonth.getTime())).toBe(true);
    });

    it('returns true for timestamp from a year ago', () => {
        const lastYear = new Date('2023-03-15T10:00:00.000Z');
        expect(getIsCashbackExpired(lastYear.getTime())).toBe(true);
    });

    it('returns false for timestamp in the current month', () => {
        const thisMonth = new Date('2024-03-10T10:00:00.000Z');
        expect(getIsCashbackExpired(thisMonth.getTime())).toBe(false);
    });

    it('returns false for timestamp at the start of the current month', () => {
        const monthStart = new Date('2024-03-01T00:00:00.000Z');
        expect(getIsCashbackExpired(monthStart.getTime())).toBe(false);
    });

    it('returns true for timestamp just before the start of the current month', () => {
        const beforeMonthStart = new Date('2024-02-29T23:59:59.999Z');
        expect(getIsCashbackExpired(beforeMonthStart.getTime())).toBe(true);
    });
});
