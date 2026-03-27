import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CashbackService } from '../cashback/cashback.service';
import { CardService } from '../card/card.service';

const mockExec = jest.fn();

const mockUserModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'new-user-id' }),
}));

Object.assign(mockUserModel, {
    findById: jest.fn().mockReturnValue({ exec: mockExec }),
    findOne: jest.fn().mockReturnValue({ exec: mockExec }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ exec: mockExec }),
    findByIdAndDelete: jest.fn().mockReturnValue({ exec: mockExec }),
});

const mockCashbackService = { findAllAndDelete: jest.fn() };
const mockCardService = { findAllAndDelete: jest.fn() };

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getModelToken(User.name), useValue: mockUserModel },
                { provide: CashbackService, useValue: mockCashbackService },
                { provide: CardService, useValue: mockCardService },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('is defined', () => {
        expect(service).toBeDefined();
    });

    describe('findById', () => {
        it('calls findById with the given id', async () => {
            const user = { _id: 'user-id', name: 'Test' };
            mockExec.mockResolvedValueOnce(user);

            const result = await service.findById('user-id');

            expect(mockUserModel.findById).toHaveBeenCalledWith('user-id');
            expect(result).toEqual(user);
        });
    });

    describe('findUserByEmail', () => {
        it('calls findOne with the given email', async () => {
            const user = { _id: 'user-id', email: 'test@example.com' };
            mockExec.mockResolvedValueOnce(user);

            const result = await service.findUserByEmail('test@example.com');

            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
            expect(result).toEqual(user);
        });

        it('returns null when user not found', async () => {
            mockExec.mockResolvedValueOnce(null);

            const result = await service.findUserByEmail('notfound@example.com');

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('creates and saves a new user', async () => {
            const dto = { email: 'new@example.com', name: 'New User', picture: 'pic.jpg' };
            const savedUser = { ...dto, _id: 'new-user-id' };

            const saveMock = jest.fn().mockResolvedValue(savedUser);
            mockUserModel.mockImplementationOnce(() => ({ ...dto, save: saveMock }));

            const result = await service.create(dto);

            expect(mockUserModel).toHaveBeenCalledWith(dto);
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(savedUser);
        });
    });

    describe('update', () => {
        it('calls findByIdAndUpdate and returns updated user', async () => {
            const updated = { _id: 'user-id', name: 'Updated' };
            mockExec.mockResolvedValueOnce(updated);

            const result = await service.update('user-id', { cashbacksView: undefined } as any);

            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'user-id',
                { cashbacksView: undefined },
                { new: true },
            );
            expect(result).toEqual(updated);
        });
    });

    describe('delete', () => {
        it('deletes all cashbacks, cards, then the user', async () => {
            const deletedUser = { _id: 'user-id', name: 'Deleted' };
            mockCashbackService.findAllAndDelete.mockResolvedValue({});
            mockCardService.findAllAndDelete.mockResolvedValue({});
            mockExec.mockResolvedValueOnce(deletedUser);

            const result = await service.delete('user-id');

            expect(mockCashbackService.findAllAndDelete).toHaveBeenCalledWith('user-id');
            expect(mockCardService.findAllAndDelete).toHaveBeenCalledWith('user-id');
            expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('user-id');
            expect(result).toEqual(deletedUser);
        });
    });
});
