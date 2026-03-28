import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CardService } from './card.service';
import { Card } from './schemas/card.schema';
import { CashbackService } from '../cashback/cashback.service';
import { EBank } from 'cashback-check-types';

const mockExec = jest.fn();

const mockCardModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'new-card-id' }),
}));

Object.assign(mockCardModel, {
    find: jest.fn().mockReturnValue({ exec: mockExec }),
    findOneAndUpdate: jest.fn().mockReturnValue({ exec: mockExec }),
    findOneAndDelete: jest.fn().mockReturnValue({ exec: mockExec }),
    deleteMany: jest.fn().mockReturnValue({ exec: mockExec }),
});

const mockCashbackService = { findAllAndUpdate: jest.fn() };

describe('CardService', () => {
    let service: CardService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardService,
                { provide: getModelToken(Card.name), useValue: mockCardModel },
                { provide: CashbackService, useValue: mockCashbackService },
            ],
        }).compile();

        service = module.get<CardService>(CardService);
    });

    it('is defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('creates and saves a new card', async () => {
            const dto = { bank: EBank.ALPHA, name: 'Основная', userId: 'user-id' };
            const savedCard = { ...dto, _id: 'new-card-id' };
            const saveMock = jest.fn().mockResolvedValue(savedCard);
            mockCardModel.mockImplementationOnce(() => ({ ...dto, save: saveMock }));

            const result = await service.create(dto);

            expect(mockCardModel).toHaveBeenCalledWith(dto);
            expect(saveMock).toHaveBeenCalled();
            expect(result).toEqual(savedCard);
        });
    });

    describe('findAll', () => {
        it('returns cards for given userId', async () => {
            const cards = [
                { bank: EBank.ALPHA, name: 'Основная', userId: 'user-id' },
                { bank: EBank.SBER, name: 'Дебетовая', userId: 'user-id' },
            ];
            mockExec.mockResolvedValueOnce(cards);

            const result = await service.findAll('user-id');

            expect(mockCardModel.find).toHaveBeenCalledWith({ userId: 'user-id' });
            expect(result).toEqual(cards);
        });
    });

    describe('findAllAndDelete', () => {
        it('deletes all cards for given userId', async () => {
            mockExec.mockResolvedValueOnce({ deletedCount: 2 });

            await service.findAllAndDelete('user-id');

            expect(mockCardModel.deleteMany).toHaveBeenCalledWith({ userId: 'user-id' });
        });
    });

    describe('update', () => {
        it('updates card and syncs related cashbacks', async () => {
            const updatedCard = { bank: EBank.T, name: 'Black', userId: 'user-id' };
            mockExec.mockResolvedValueOnce(updatedCard);
            mockCashbackService.findAllAndUpdate.mockResolvedValue({});

            const result = await service.update(
                'user-id',
                'Основная',
                EBank.ALPHA,
                { bank: EBank.T, name: 'Black', userId: 'user-id' },
            );

            expect(mockCardModel.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: 'user-id', name: 'Основная', bank: EBank.ALPHA },
                { bank: EBank.T, name: 'Black', userId: 'user-id' },
                { new: true },
            );
            expect(mockCashbackService.findAllAndUpdate).toHaveBeenCalledWith(
                { userId: 'user-id', card: { name: 'Основная', bank: EBank.ALPHA } },
                { card: { bank: EBank.T, name: 'Black', userId: 'user-id' } },
            );
            expect(result).toEqual(updatedCard);
        });
    });

    describe('remove', () => {
        it('removes card and nullifies related cashbacks', async () => {
            const deletedCard = { bank: EBank.ALPHA, name: 'Основная', userId: 'user-id' };
            mockExec.mockResolvedValueOnce(deletedCard);
            mockCashbackService.findAllAndUpdate.mockResolvedValue({});

            const result = await service.remove('user-id', 'Основная', EBank.ALPHA);

            expect(mockCardModel.findOneAndDelete).toHaveBeenCalledWith({
                userId: 'user-id',
                name: 'Основная',
                bank: EBank.ALPHA,
            });
            expect(mockCashbackService.findAllAndUpdate).toHaveBeenCalledWith(
                { userId: 'user-id', card: { name: 'Основная', bank: EBank.ALPHA } },
                { card: null },
            );
            expect(result).toEqual(deletedCard);
        });
    });
});
