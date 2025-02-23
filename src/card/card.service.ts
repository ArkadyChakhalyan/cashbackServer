import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCardDto } from './createCardDto';
import { EBank, TUserId } from 'cashback-check-types';
import { Card } from './schemas/card.schema';
import { CashbackService } from '../cashback/cashback.service';

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card.name)
        private readonly cardModel: Model<Card>,
        private readonly cashbackService: CashbackService,
    ) {}

    async create(createCardDto: CreateCardDto): Promise<Card> {
        const createdCard = new this.cardModel(createCardDto);
        return createdCard.save();
    }

    async findAll(userId: TUserId): Promise<Card[]> {
        return await this.cardModel.find({ userId }).exec();
    }

    async update(
        userId: TUserId,
        name: string,
        bank: EBank,
        updateCardDto: CreateCardDto,
    ): Promise<Card> {
        const result = await this.cardModel.findOneAndUpdate({ userId, name, bank }, updateCardDto, { new: true }).exec();
        await this.cashbackService.findAllAndUpdate({ userId, card: { name, bank }}, { card: updateCardDto });
        return result;
    }

    async remove(
        userId: TUserId,
        name: string,
        bank: EBank,
    ): Promise<Card> {
        const result = this.cardModel.findOneAndDelete({ userId, name, bank }).exec();
        await this.cashbackService.findAllAndUpdate({ userId, card: { name, bank } }, { card: null });
        return result;
    }
}
