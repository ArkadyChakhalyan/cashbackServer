import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;

    beforeAll(() => {
        process.env.JWT_SECRET = 'test-secret';
    });

    beforeEach(() => {
        strategy = new JwtStrategy();
    });

    it('is defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('returns userId from payload', async () => {
            const payload = { userId: 'user-id-123' };
            const result = await strategy.validate(payload);
            expect(result).toEqual({ userId: 'user-id-123' });
        });

        it('passes through different userId formats', async () => {
            const payload = { userId: 'another-user-456', extra: 'ignored' };
            const result = await strategy.validate(payload);
            expect(result).toEqual({ userId: 'another-user-456' });
        });
    });
});
