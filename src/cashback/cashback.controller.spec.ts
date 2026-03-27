import { Test, TestingModule } from '@nestjs/testing';
import { CashbackController } from './cashback.controller';
import { CashbackService } from './cashback.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ECashbackColor, ECashbackIcon, EBank } from 'cashback-check-types';

const mockCashbackService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

const mockId = { toString: () => 'cashback-id-123' };

const mockCashback = (overrides = {}) => ({
    _id: mockId,
    bank: EBank.ALPHA,
    bankOrderNumber: 1,
    cardOrderNumber: 0,
    color: ECashbackColor.BLUE,
    icon: ECashbackIcon.GROCERY,
    name: 'Продукты',
    orderNumber: 1,
    percentage: 5,
    timestamp: 1711497600000,
    userId: 'user-id',
    ...overrides,
});

const expectedTransformed = (overrides = {}) => ({
    bank: EBank.ALPHA,
    bankOrderNumber: 1,
    card: null,
    cardOrderNumber: 0,
    color: ECashbackColor.BLUE,
    icon: ECashbackIcon.GROCERY,
    id: 'cashback-id-123',
    name: 'Продукты',
    orderNumber: 1,
    percentage: 5,
    timestamp: 1711497600000,
    ...overrides,
});

const mockRes = () => {
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
};

describe('CashbackController', () => {
    let controller: CashbackController;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CashbackController],
            providers: [{ provide: CashbackService, useValue: mockCashbackService }],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<CashbackController>(CashbackController);
    });

    it('is defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('creates a cashback and returns transformed result', async () => {
            const cashback = mockCashback();
            mockCashbackService.create.mockResolvedValue(cashback);
            const req = { user: { userId: 'user-id' } } as any;
            const res = mockRes();
            const dto = { bank: EBank.ALPHA, name: 'Продукты', percentage: 5, timestamp: 1711497600000, orderNumber: 1, bankOrderNumber: 1, cardOrderNumber: 0 };

            await controller.create(dto, req, res);

            expect(mockCashbackService.create).toHaveBeenCalledWith({ ...dto, userId: 'user-id' });
            expect(res.json).toHaveBeenCalledWith(expectedTransformed());
        });
    });

    describe('findAll', () => {
        it('returns transformed list of cashbacks', async () => {
            const cashbacks = [mockCashback(), mockCashback({ name: 'Такси', icon: ECashbackIcon.TAXI })];
            mockCashbackService.findAll.mockResolvedValue(cashbacks);
            const req = { user: { userId: 'user-id' } } as any;
            const res = mockRes();

            await controller.findAll(req, res);

            expect(mockCashbackService.findAll).toHaveBeenCalledWith('user-id');
            const jsonArg = res.json.mock.calls[0][0];
            expect(jsonArg).toHaveLength(2);
            expect(jsonArg[0].id).toBe('cashback-id-123');
        });

        it('returns empty array when no cashbacks', async () => {
            mockCashbackService.findAll.mockResolvedValue(null);
            const req = { user: { userId: 'user-id' } } as any;
            const res = mockRes();

            await controller.findAll(req, res);

            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('update', () => {
        it('updates a cashback and returns transformed result', async () => {
            const updated = mockCashback({ name: 'Рестораны', icon: ECashbackIcon.RESTAURANT, color: ECashbackColor.RED });
            mockCashbackService.update.mockResolvedValue(updated);
            const res = mockRes();
            const dto = { name: 'Рестораны', percentage: 3 };

            await controller.update('cashback-id-123', dto, res);

            expect(mockCashbackService.update).toHaveBeenCalledWith('cashback-id-123', dto);
            const jsonArg = res.json.mock.calls[0][0];
            expect(jsonArg.name).toBe('Рестораны');
            expect(jsonArg.id).toBe('cashback-id-123');
        });
    });

    describe('remove', () => {
        it('removes a cashback and returns transformed result', async () => {
            const cashback = mockCashback();
            mockCashbackService.remove.mockResolvedValue(cashback);
            const res = mockRes();

            await controller.remove('cashback-id-123', res);

            expect(mockCashbackService.remove).toHaveBeenCalledWith('cashback-id-123');
            expect(res.json).toHaveBeenCalledWith(expectedTransformed());
        });
    });
});
