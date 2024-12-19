import { Cashback } from '../schemas/cashback.schema';
import { ICashback } from 'cashback-check-types/cashback';

export function getTransformedCashback(cashback: Cashback): ICashback {
    const { _id,
        bank,
        bankOrderNumber,
        name,
        orderNumber,
        percentage,
        timestamp,
        color,
        icon
    } = cashback;
    return {
        bank,
        bankOrderNumber,
        color,
        icon,
        id: _id.toString(),
        name,
        orderNumber,
        percentage,
        timestamp,
    };
}
