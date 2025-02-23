import { Card } from '../schemas/card.schema';
import { ICard } from 'cashback-check-types';

export function getTransformedCard(card: Card): ICard {
    const {
        bank,
        name,
    } = card;
    return {
        bank,
        name,
    };
}
