export function getCashbackNextMonth() {
    const date = new Date();
    date.setMonth(new Date().getMonth() + 1);
    return date.getMonth();
}
