import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from './google.strategy';
import { UserService } from '../../user/user.service';

const mockUserService = {
    findUserByEmail: jest.fn(),
    create: jest.fn(),
};

describe('GoogleStrategy', () => {
    let strategy: GoogleStrategy;

    beforeAll(() => {
        process.env.GOOGLE_CLIENT_ID = 'test-client-id';
        process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
        process.env.URL = 'http://localhost:3001';
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoogleStrategy,
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        strategy = module.get<GoogleStrategy>(GoogleStrategy);
    });

    it('is defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        const profile = {
            displayName: 'Test User',
            emails: [{ value: 'test@gmail.com' }],
            photos: [{ value: 'https://photo.url/pic.jpg' }],
        } as any;

        it('returns existing user if found by email', async () => {
            const existingUser = { _id: 'user-id', email: 'test@gmail.com' };
            mockUserService.findUserByEmail.mockResolvedValue(existingUser);
            const done = jest.fn();

            await strategy.validate('access-token', 'refresh-token', profile, done);

            expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('test@gmail.com');
            expect(mockUserService.create).not.toHaveBeenCalled();
            expect(done).toHaveBeenCalledWith(null, existingUser);
        });

        it('creates a new user when not found', async () => {
            const newUser = { _id: 'new-id', email: 'test@gmail.com', name: 'Test User' };
            mockUserService.findUserByEmail.mockResolvedValue(null);
            mockUserService.create.mockResolvedValue(newUser);
            const done = jest.fn();

            await strategy.validate('access-token', 'refresh-token', profile, done);

            expect(mockUserService.create).toHaveBeenCalledWith({
                email: 'test@gmail.com',
                name: 'Test User',
                picture: 'https://photo.url/pic.jpg',
            });
            expect(done).toHaveBeenCalledWith(null, newUser);
        });
    });
});
