import { Test, TestingModule } from '@nestjs/testing';
import { YandexStrategy } from './yandex.strategy';
import { UserService } from '../../user/user.service';

const mockUserService = {
    findUserByEmail: jest.fn(),
    create: jest.fn(),
};

describe('YandexStrategy', () => {
    let strategy: YandexStrategy;

    beforeAll(() => {
        process.env.YANDEX_CLIENT_ID = 'test-yandex-client-id';
        process.env.YANDEX_CLIENT_SECRET = 'test-yandex-client-secret';
        process.env.URL = 'http://localhost:3001';
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                YandexStrategy,
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        strategy = module.get<YandexStrategy>(YandexStrategy);
    });

    it('is defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        const baseProfile = {
            id: 'yandex-user-123',
            displayName: 'Yandex User',
            photos: [{ value: 'https://yandex.photo/pic.jpg' }],
        } as any;

        it('returns existing user if found by email', async () => {
            const profile = { ...baseProfile, emails: [{ value: 'user@yandex.ru' }] };
            const existingUser = { _id: 'user-id', email: 'user@yandex.ru' };
            mockUserService.findUserByEmail.mockResolvedValue(existingUser);
            const done = jest.fn();

            await strategy.validate('access-token', 'refresh-token', profile, done);

            expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('user@yandex.ru');
            expect(mockUserService.create).not.toHaveBeenCalled();
            expect(done).toHaveBeenCalledWith(null, existingUser);
        });

        it('creates a new user when not found', async () => {
            const profile = { ...baseProfile, emails: [{ value: 'newuser@yandex.ru' }] };
            const newUser = { _id: 'new-id', email: 'newuser@yandex.ru' };
            mockUserService.findUserByEmail.mockResolvedValue(null);
            mockUserService.create.mockResolvedValue(newUser);
            const done = jest.fn();

            await strategy.validate('access-token', 'refresh-token', profile, done);

            expect(mockUserService.create).toHaveBeenCalledWith({
                email: 'newuser@yandex.ru',
                name: 'Yandex User',
                picture: 'https://yandex.photo/pic.jpg',
            });
            expect(done).toHaveBeenCalledWith(null, newUser);
        });

        it('falls back to id@yandex.ru when emails are absent', async () => {
            const profile = { ...baseProfile, emails: null };
            const newUser = { _id: 'new-id', email: 'yandex-user-123@yandex.ru' };
            mockUserService.findUserByEmail.mockResolvedValue(null);
            mockUserService.create.mockResolvedValue(newUser);
            const done = jest.fn();

            await strategy.validate('access-token', 'refresh-token', profile, done);

            expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('yandex-user-123@yandex.ru');
        });

        it('falls back to id@yandex.ru when emails array is empty', async () => {
            const profile = { ...baseProfile, emails: [] };
            mockUserService.findUserByEmail.mockResolvedValue(null);
            mockUserService.create.mockResolvedValue({});
            const done = jest.fn();

            await strategy.validate('access-token', 'refresh-token', profile, done);

            expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('yandex-user-123@yandex.ru');
        });
    });
});
