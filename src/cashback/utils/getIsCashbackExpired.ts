export function getIsCashbackExpired(timestamp: number) {
    const date = new Date(timestamp);
    const currentMonthStart = new Date();

    currentMonthStart.setUTCDate(1);
    currentMonthStart.setUTCHours(0, 0, 0, 0);

    return date < currentMonthStart;
}
