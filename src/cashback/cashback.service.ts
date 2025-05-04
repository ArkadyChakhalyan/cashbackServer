import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cashback } from './schemas/cashback.schema';
import { CreateCashbackDto } from './createCashbackDto';
import { TCashbackId, TUserId } from 'cashback-check-types';
import { getCashbackIcon } from './utils/getCashbackIcon';
import { getCashbackColor } from './utils/getCashbackColor';
import { getIsCashbackExpired } from './utils/getIsCashbackExpired';

@Injectable()
export class CashbackService {
    constructor(
        @InjectModel(Cashback.name)
        private readonly cashbackModel: Model<Cashback>,
    ) {}

    async create(createCashbackDto: CreateCashbackDto): Promise<Cashback> {
        const icon = getCashbackIcon(createCashbackDto.name);
        const createdCashback = new this.cashbackModel({
            ...createCashbackDto,
            color: getCashbackColor(icon),
            icon,
        });
        return createdCashback.save();
    }

    async removeOldCashbacks(userId: TUserId) {
        const cashbacks = await this.cashbackModel
            .find({ userId })
            .exec();
        for (const cashback of cashbacks) {
            if (getIsCashbackExpired(cashback.timestamp)) {
                await this.remove(cashback.id);
            }
        }
    }

    async findAll(userId: TUserId): Promise<Cashback[]> {
        await this.removeOldCashbacks(userId);
        return await this.cashbackModel.find({ userId }).exec();
    }

    async findAllAndDelete(userId: TUserId): Promise<any> {
        return this.cashbackModel.deleteMany( { userId }).exec();
    }

    async findAllAndUpdate(
        filter: Partial<CreateCashbackDto>,
        updateCashbackDto: Partial<CreateCashbackDto>
    ): Promise<any> {
        return this.cashbackModel.updateMany(filter, updateCashbackDto).exec();
    }

    async update(
        id: TCashbackId,
        updateCashbackDto: Partial<CreateCashbackDto>,
    ): Promise<Cashback> {
        const cashback = await this.cashbackModel.findById(id).exec();
        const icon = getCashbackIcon(updateCashbackDto.name);
        if (icon !== cashback.icon) {
            updateCashbackDto = {
                ...updateCashbackDto,
                icon: icon,
                color: getCashbackColor(icon),
            }
        }
        return this.cashbackModel
            .findByIdAndUpdate(id, updateCashbackDto, {
                new: true,
            })
            .exec();
    }

    async remove(id: TCashbackId): Promise<Cashback> {
        return this.cashbackModel.findByIdAndDelete(id).exec();
    }
}
