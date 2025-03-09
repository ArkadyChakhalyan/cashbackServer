export function getIsCashbackExpired(timestamp: number) {
    const date = new Date(timestamp);
    const currentMonthStart = new Date();

    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    return date < currentMonthStart;
}
