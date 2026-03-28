import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CashbackService } from './cashback.service';
import { Cashback } from './schemas/cashback.schema';
import { ECashbackColor, ECashbackIcon, EBank } from 'cashback-check-types';

const mockExec = jest.fn();

const mockCashbackModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'new-cashback-id' }),
}));

Object.assign(mockCashbackModel, {
    find: jest.fn().mockReturnValue({ exec: mockExec }),
    findById: jest.fn().mockReturnValue({ exec: mockExec }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ exec: mockExec }),
    findByIdAndDelete: jest.fn().mockReturnValue({ exec: mockExec }),
    deleteMany: jest.fn().mockReturnValue({ exec: mockExec }),
    updateMany: jest.fn().mockReturnValue({ exec: mockExec }),
});

const baseDto = {
    bank: EBank.ALPHA,
    name: 'Продукты',
    percentage: 5,
    timestamp: Date.now(),
    userId: 'user-id',
    orderNumber: 1,
    bankOrderNumber: 0,
    cardOrderNumber: 0,
};

describe('CashbackService', () => {
    let service: CashbackService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CashbackService,
                { provide: getModelToken(Cashback.name), useValue: mockCashbackModel },
            ],
        }).compile();

        service = module.get<CashbackService>(CashbackService);
    });

    it('is defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('assigns icon and color based on name', async () => {
            const savedCashback = {
                ...baseDto,
                icon: ECashbackIcon.GROCERY,
                color: ECashbackColor.BLUE,
                _id: 'new-cashback-id',
            };
            const saveMock = jest.fn().mockResolvedValue(savedCashback);
            mockCashbackModel.mockImplementationOnce((dto) => ({ ...dto, save: saveMock }));

            const result = await service.create(baseDto as any);

            const constructorArg = mockCashbackModel.mock.calls[0][0];
            expect(constructorArg.icon).toBe(ECashbackIcon.GROCERY);
            expect(constructorArg.color).toBe(ECashbackColor.BLUE);
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(savedCashback);
        });

        it('uses OTHER icon for unknown category', async () => {
            const dto = { ...baseDto, name: 'Неизвестное' };
            const saveMock = jest.fn().mockResolvedValue({ ...dto, _id: 'id' });
            mockCashbackModel.mockImplementationOnce((d) => ({ ...d, save: saveMock }));

            await service.create(dto as any);

            const constructorArg = mockCashbackModel.mock.calls[0][0];
            expect(constructorArg.icon).toBe(ECashbackIcon.OTHER);
        });
    });

    describe('findAll', () => {
        it('deletes expired cashbacks and returns remaining', async () => {
            const cashbacks = [{ ...baseDto, _id: 'id-1' }];
            mockExec
                .mockResolvedValueOnce({ deletedCount: 0 }) // deleteMany
                .mockResolvedValueOnce(cashbacks);           // find

            const result = await service.findAll('user-id');

            expect(mockCashbackModel.deleteMany).toHaveBeenCalled();
            const deleteManyArg = mockCashbackModel.deleteMany.mock.calls[0][0];
            expect(deleteManyArg.userId).toBe('user-id');
            expect(deleteManyArg.timestamp).toBeDefined();
            expect(mockCashbackModel.find).toHaveBeenCalledWith({ userId: 'user-id' });
            expect(result).toEqual(cashbacks);
        });
    });

    describe('findAllAndDelete', () => {
        it('deletes all cashbacks for given userId', async () => {
            mockExec.mockResolvedValueOnce({ deletedCount: 3 });

            await service.findAllAndDelete('user-id');

            expect(mockCashbackModel.deleteMany).toHaveBeenCalledWith({ userId: 'user-id' });
        });
    });

    describe('findAllAndUpdate', () => {
        it('calls updateMany with given filter and update', async () => {
            mockExec.mockResolvedValueOnce({ modifiedCount: 1 });

            await service.findAllAndUpdate(
                { userId: 'user-id', card: { name: 'Old', bank: EBank.ALPHA } },
                { card: null },
            );

            expect(mockCashbackModel.updateMany).toHaveBeenCalledWith(
                { userId: 'user-id', card: { name: 'Old', bank: EBank.ALPHA } },
                { card: null },
            );
        });
    });

    describe('update', () => {
        it('updates icon and color when name changes to a different category', async () => {
            const existingCashback = {
                ...baseDto,
                icon: ECashbackIcon.GROCERY,
                color: ECashbackColor.BLUE,
            };
            const updatedCashback = {
                ...baseDto,
                name: 'Такси',
                icon: ECashbackIcon.TAXI,
                color: ECashbackColor.YELLOW,
            };
            mockExec
                .mockResolvedValueOnce(existingCashback)  // findById
                .mockResolvedValueOnce(updatedCashback);   // findByIdAndUpdate

            const result = await service.update('cashback-id', { name: 'Такси' });

            const updateArg = mockCashbackModel.findByIdAndUpdate.mock.calls[0][1];
            expect(updateArg.icon).toBe(ECashbackIcon.TAXI);
            expect(updateArg.color).toBe(ECashbackColor.YELLOW);
            expect(result).toEqual(updatedCashback);
        });

        it('does not change icon/color when icon stays the same', async () => {
            const existingCashback = {
                ...baseDto,
                icon: ECashbackIcon.GROCERY,
                color: ECashbackColor.BLUE,
            };
            const updatedCashback = { ...baseDto, name: 'Супермаркет', icon: ECashbackIcon.GROCERY };
            mockExec
                .mockResolvedValueOnce(existingCashback)
                .mockResolvedValueOnce(updatedCashback);

            await service.update('cashback-id', { name: 'Супермаркет' });

            const updateArg = mockCashbackModel.findByIdAndUpdate.mock.calls[0][1];
            expect(updateArg).not.toHaveProperty('icon');
            expect(updateArg).not.toHaveProperty('color');
        });
    });

    describe('remove', () => {
        it('deletes cashback by id', async () => {
            const deleted = { ...baseDto, _id: 'cashback-id' };
            mockExec.mockResolvedValueOnce(deleted);

            const result = await service.remove('cashback-id');

            expect(mockCashbackModel.findByIdAndDelete).toHaveBeenCalledWith('cashback-id');
            expect(result).toEqual(deleted);
        });
    });
});
