import { EBank } from 'cashback-check-types';
import { getTransformedCard } from './getTransformedCard';

describe('getTransformedCard', () => {
    it('maps bank and name correctly', () => {
        const card = { bank: EBank.ALPHA, name: 'Основная', userId: 'user-123' };
        const result = getTransformedCard(card as any);
        expect(result).toEqual({ bank: EBank.ALPHA, name: 'Основная' });
    });

    it('does not expose userId', () => {
        const card = { bank: EBank.SBER, name: 'Дебетовая', userId: 'user-456' };
        const result = getTransformedCard(card as any);
        expect(result).not.toHaveProperty('userId');
    });

    it('works with different banks', () => {
        const card = { bank: EBank.T, name: 'Black', userId: 'user-789' };
        const result = getTransformedCard(card as any);
        expect(result.bank).toBe(EBank.T);
        expect(result.name).toBe('Black');
    });
});
