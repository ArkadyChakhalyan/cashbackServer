import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ECashbacksView } from 'cashback-check-types';

const mockUserService = {
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

const mockUser = {
    _id: { toString: () => 'user-id-123' },
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/photo.jpg',
    cashbacksView: undefined,
    seenStories: undefined,
    settings: undefined,
};

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{ provide: UserService, useValue: mockUserService }],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<UserController>(UserController);
    });

    it('is defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getProfile', () => {
        it('returns transformed user for authenticated request', async () => {
            mockUserService.findById.mockResolvedValue(mockUser);
            const req = { user: { userId: 'user-id-123' } } as any;

            const result = await controller.getProfile(req);

            expect(mockUserService.findById).toHaveBeenCalledWith('user-id-123');
            expect(result).toEqual({
                id: 'user-id-123',
                email: 'test@example.com',
                name: 'Test User',
                picture: 'https://example.com/photo.jpg',
                cashbacksView: undefined,
                seenStories: undefined,
                settings: undefined,
            });
        });

        it('throws UnauthorizedException when userId is missing', async () => {
            const req = { user: {} } as any;

            await expect(controller.getProfile(req)).rejects.toThrow(UnauthorizedException);
            expect(mockUserService.findById).not.toHaveBeenCalled();
        });
    });

    describe('updateProfile', () => {
        it('updates and returns transformed user', async () => {
            const updatedUser = {
                ...mockUser,
                cashbacksView: ECashbacksView.BANK,
            };
            mockUserService.update.mockResolvedValue(updatedUser);
            const req = { user: { userId: 'user-id-123' } } as any;
            const dto = { cashbacksView: ECashbacksView.BANK };

            const result = await controller.updateProfile(req, dto as any);

            expect(mockUserService.update).toHaveBeenCalledWith('user-id-123', dto);
            expect(result.cashbacksView).toBe(ECashbacksView.BANK);
        });

        it('throws UnauthorizedException when userId is missing', async () => {
            const req = { user: {} } as any;

            await expect(controller.updateProfile(req, {} as any)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('deleteProfile', () => {
        it('deletes user and returns result', async () => {
            mockUserService.delete.mockResolvedValue(mockUser);
            const req = { user: { userId: 'user-id-123' } } as any;

            const result = await controller.deleteProfile(req);

            expect(mockUserService.delete).toHaveBeenCalledWith('user-id-123');
            expect(result).toEqual(mockUser);
        });

        it('throws UnauthorizedException when userId is missing', async () => {
            const req = { user: {} } as any;

            await expect(controller.deleteProfile(req)).rejects.toThrow(UnauthorizedException);
        });
    });
});
