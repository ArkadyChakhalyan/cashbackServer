import { Cashback } from '../schemas/cashback.schema';
import { ICashback } from 'cashback-check-types';

export function getTransformedCashback(cashback: Cashback): ICashback {
    const { _id,
        bank,
        bankOrderNumber,
        name,
        orderNumber,
        percentage,
        timestamp,
        color,
        card,
        icon
    } = cashback;
    return {
        bank,
        bankOrderNumber,
        card,
        color,
        icon,
        id: _id.toString(),
        name,
        orderNumber,
        percentage,
        timestamp,
    };
}
