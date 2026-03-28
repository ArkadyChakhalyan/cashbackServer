import { ECashbacksView } from 'cashback-check-types';
import { getTransformedUser } from './getTransformedUser';

const mockId = { toString: () => 'user-id-123' };

const baseUser = {
    _id: mockId,
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/photo.jpg',
};

describe('getTransformedUser', () => {
    it('maps required fields correctly', () => {
        const result = getTransformedUser(baseUser as any);
        expect(result).toEqual({
            email: 'test@example.com',
            id: 'user-id-123',
            name: 'Test User',
            picture: 'https://example.com/photo.jpg',
            cashbacksView: undefined,
            seenStories: undefined,
            settings: undefined,
        });
    });

    it('converts _id to string id', () => {
        const result = getTransformedUser(baseUser as any);
        expect(result.id).toBe('user-id-123');
    });

    it('includes optional fields when present', () => {
        const userWithOptionals = {
            ...baseUser,
            cashbacksView: ECashbacksView.BANK,
            seenStories: [1, 2, 3],
            settings: { isHideStories: true },
        };
        const result = getTransformedUser(userWithOptionals as any);
        expect(result.cashbacksView).toBe(ECashbacksView.BANK);
        expect(result.seenStories).toEqual([1, 2, 3]);
        expect(result.settings).toEqual({ isHideStories: true });
    });

    it('does not expose _id directly', () => {
        const result = getTransformedUser(baseUser as any);
        expect(result).not.toHaveProperty('_id');
    });
});
