import { EBank, ICard } from 'cashback-check-types';
import { Cashback } from '../schemas/cashback.schema';

export const getCashbackCardOrderNumber = (
    cashbacks: Cashback[],
    card: ICard,
    bank: EBank,
): number => {
    const sortedCashbacks = [...cashbacks]
        .sort((a, b) => (a.cardOrderNumber ?? -1) - (b.cardOrderNumber ?? -1));

    let cardOrderNumber;
    const cardCashbacks = sortedCashbacks.filter(cashback => {
        return card ? cashback.card && cashback.card.bank === card.bank && cashback.card.name === card.name : cashback.bank === bank;
    });

    const maxOrderNumber = Math.max(...sortedCashbacks.map(cashback => cashback.cardOrderNumber ?? 0), 0);

    if (cardCashbacks.length > 0) {
        const lastCardCashback = cardCashbacks[cardCashbacks.length - 1];
        const nextCashback = sortedCashbacks.find(cashback => {
            return (
                !cashback.card ||
                cashback.card?.bank !== card?.bank ||
                cashback.card?.name !== card?.name
            ) && (
                !Number.isFinite(lastCardCashback.cardOrderNumber) ||
                cashback.cardOrderNumber > lastCardCashback.cardOrderNumber
            );
        });
        if (nextCashback) {
            cardOrderNumber = Math.floor(
                ((lastCardCashback.cardOrderNumber ?? maxOrderNumber) + (nextCashback.cardOrderNumber ?? maxOrderNumber + 1)) / 2
            );
        } else {
            cardOrderNumber = (lastCardCashback.cardOrderNumber ?? maxOrderNumber) + 1;
        }
    } else {
        cardOrderNumber = sortedCashbacks.length
            ? (sortedCashbacks[sortedCashbacks.length - 1].cardOrderNumber ?? maxOrderNumber) + 1
            : 0;
    }

    return cardOrderNumber;
};
