import { Cashback } from '../schemas/cashback.schema';
import { ICashback } from 'cashback-check-types';

export function getTransformedCashback(cashback: Cashback): ICashback {
    const { _id,
        bank,
        bankOrderNumber,
        card = null,
        cardOrderNumber,
        color,
        icon,
        name,
        orderNumber,
        percentage,
        timestamp,
    } = cashback;
    return {
        bank,
        bankOrderNumber,
        card,
        cardOrderNumber,
        color,
        icon,
        id: _id.toString(),
        name,
        orderNumber,
        percentage,
        timestamp,
    };
}
