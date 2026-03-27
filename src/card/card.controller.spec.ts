import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { EBank } from 'cashback-check-types';

const mockCardService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

const mockCard = (bank = EBank.ALPHA, name = 'Основная', userId = 'user-id') => ({
    bank,
    name,
    userId,
    _id: { toString: () => 'card-id' },
});

const mockRes = () => {
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
};

describe('CardController', () => {
    let controller: CardController;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CardController],
            providers: [{ provide: CardService, useValue: mockCardService }],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<CardController>(CardController);
    });

    it('is defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('creates a card and returns transformed result', async () => {
            const card = mockCard();
            mockCardService.create.mockResolvedValue(card);
            const req = { user: { userId: 'user-id' } } as any;
            const res = mockRes();
            const dto = { bank: EBank.ALPHA, name: 'Основная' };

            await controller.create(dto, req, res);

            expect(mockCardService.create).toHaveBeenCalledWith({ ...dto, userId: 'user-id' });
            expect(res.json).toHaveBeenCalledWith({ bank: EBank.ALPHA, name: 'Основная' });
        });
    });

    describe('findAll', () => {
        it('returns transformed list of cards', async () => {
            const cards = [mockCard(EBank.ALPHA, 'Основная'), mockCard(EBank.SBER, 'Дебетовая')];
            mockCardService.findAll.mockResolvedValue(cards);
            const req = { user: { userId: 'user-id' } } as any;
            const res = mockRes();

            await controller.findAll(req, res);

            expect(mockCardService.findAll).toHaveBeenCalledWith('user-id');
            expect(res.json).toHaveBeenCalledWith([
                { bank: EBank.ALPHA, name: 'Основная' },
                { bank: EBank.SBER, name: 'Дебетовая' },
            ]);
        });

        it('returns empty array when no cards found', async () => {
            mockCardService.findAll.mockResolvedValue(null);
            const req = { user: { userId: 'user-id' } } as any;
            const res = mockRes();

            await controller.findAll(req, res);

            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('update', () => {
        it('updates a card and returns transformed result', async () => {
            const updatedCard = mockCard(EBank.T, 'Black');
            mockCardService.update.mockResolvedValue(updatedCard);
            const req = { user: { userId: 'user-id' } } as any;
            const res = mockRes();
            const dto = { bank: EBank.T, name: 'Black', userId: 'user-id' };

            await controller.update('Основная', EBank.ALPHA, dto, req, res);

            expect(mockCardService.update).toHaveBeenCalledWith(
                'user-id',
                'Основная',
                EBank.ALPHA,
                dto,
            );
            expect(res.json).toHaveBeenCalledWith({ bank: EBank.T, name: 'Black' });
        });
    });

    describe('remove', () => {
        it('removes a card and returns transformed result', async () => {
            const deletedCard = mockCard();
            mockCardService.remove.mockResolvedValue(deletedCard);
            const req = { user: { userId: 'user-id' } } as any;
            const res = mockRes();

            await controller.remove('Основная', EBank.ALPHA, req, res);

            expect(mockCardService.remove).toHaveBeenCalledWith('user-id', 'Основная', EBank.ALPHA);
            expect(res.json).toHaveBeenCalledWith({ bank: EBank.ALPHA, name: 'Основная' });
        });
    });
});
