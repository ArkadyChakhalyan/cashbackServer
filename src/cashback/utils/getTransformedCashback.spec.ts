import { ECashbackColor, ECashbackIcon, EBank } from 'cashback-check-types';
import { getTransformedCashback } from './getTransformedCashback';

const mockId = { toString: () => 'cashback-id-123' };

const baseCashback = {
    _id: mockId,
    bank: EBank.ALPHA,
    bankOrderNumber: 1,
    cardOrderNumber: 0,
    color: ECashbackColor.BLUE,
    icon: ECashbackIcon.GROCERY,
    name: 'Продукты',
    orderNumber: 2,
    percentage: 5,
    timestamp: 1711497600000,
    userId: 'user-123',
};

describe('getTransformedCashback', () => {
    it('maps all fields correctly', () => {
        const result = getTransformedCashback(baseCashback as any);
        expect(result).toEqual({
            bank: EBank.ALPHA,
            bankOrderNumber: 1,
            card: null,
            cardOrderNumber: 0,
            color: ECashbackColor.BLUE,
            icon: ECashbackIcon.GROCERY,
            id: 'cashback-id-123',
            name: 'Продукты',
            orderNumber: 2,
            percentage: 5,
            timestamp: 1711497600000,
        });
    });

    it('includes card when present', () => {
        const cashbackWithCard = {
            ...baseCashback,
            card: { bank: EBank.ALPHA, name: 'Основная' },
        };
        const result = getTransformedCashback(cashbackWithCard as any);
        expect(result.card).toEqual({ bank: EBank.ALPHA, name: 'Основная' });
    });

    it('defaults card to null when absent', () => {
        const result = getTransformedCashback(baseCashback as any);
        expect(result.card).toBeNull();
    });

    it('converts _id to string id', () => {
        const result = getTransformedCashback(baseCashback as any);
        expect(result.id).toBe('cashback-id-123');
    });

    it('does not expose userId', () => {
        const result = getTransformedCashback(baseCashback as any);
        expect(result).not.toHaveProperty('userId');
    });
});
