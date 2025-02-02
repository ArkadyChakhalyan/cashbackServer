import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cashback } from './schemas/cashback.schema';
import { CreateCashbackDto } from './createCashbackDto';
import { TUserId } from 'cashback-check-types';
import { getCashbackIcon } from './utils/getCashbackIcon';
import { getCashbackColor } from './utils/getCashbackColor';

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

    async findAll(userId: TUserId): Promise<Cashback[]> {
        const cashbacks = await this.cashbackModel.find({ userId }).exec();
        return cashbacks.reduce((cashbacks, cashback) => {
            const currentMonthDate = new Date();
            const nextMonthDate = new Date();
            nextMonthDate.setMonth(currentMonthDate.getMonth() + 1);
            const cashbackMonth = new Date(cashback.timestamp).getMonth();
            if ([cashbackMonth, nextMonthDate].includes(cashbackMonth)) {
                cashbacks.push(cashback);
            } else {
                this.remove(cashback.id);
            }
            return cashbacks;
        }, []);
    }

    async findAllAndDelete(userId: TUserId): Promise<any> {
        return this.cashbackModel.deleteMany( { userId }).exec();
    }

    async update(
        id: string,
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

    async remove(id: TUserId): Promise<Cashback> {
        return this.cashbackModel.findByIdAndDelete(id).exec();
    }
}
