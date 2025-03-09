import { EBank } from 'cashback-check-types';
import { Cashback } from '../schemas/cashback.schema';

export function getCashbackBankOrderNumber(
    cashbacks: Cashback[],
    bank: EBank,
): number {
    const sortedCashbacks = [...cashbacks]
        .sort((a, b) => a.bankOrderNumber - b.bankOrderNumber);

    let bankOrderNumber;
    const bankCashbacks = sortedCashbacks.filter(cashback => cashback.bank === bank);

    if (bankCashbacks.length > 0) {
        const lastBankCashback = bankCashbacks[bankCashbacks.length - 1];
        const nextCashback = sortedCashbacks.find(cashback => cashback.bank !== bank && cashback.bankOrderNumber > lastBankCashback.bankOrderNumber);

        if (nextCashback) {
            bankOrderNumber = Math.floor((lastBankCashback.bankOrderNumber + nextCashback.bankOrderNumber) / 2);
        } else {
            bankOrderNumber = lastBankCashback.bankOrderNumber + 1;
        }
    } else {
        bankOrderNumber = sortedCashbacks.length ? sortedCashbacks[sortedCashbacks.length - 1].bankOrderNumber + 1 : 0;
    }

    return bankOrderNumber;
}
