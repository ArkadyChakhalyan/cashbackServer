import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cashback } from './schemas/cashback.schema';
import { CreateCashbackDto } from './createCashbackDto';
import { ICashback, TCashbackId, TUserId } from 'cashback-check-types';
import { getCashbackIcon } from './utils/getCashbackIcon';
import { getCashbackColor } from './utils/getCashbackColor';
import { getCashbackNextMonth } from './utils/getCashbackNextMonth';
import { getIsCashbackExpired } from './utils/getIsCashbackExpired';
import { getCashbackBankOrderNumber } from './utils/getCashbackBankOrderNumber';

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
        const cashbacks = await this.cashbackModel.find({ userId }).exec();
        cashbacks.forEach(async (cashback) => {
            if (getIsCashbackExpired(cashback.timestamp)) {
                await this.remove(cashback.id);
            }
        });
    }

    async addTimelessCashbacks(userId: TUserId) {
        let cashbacks: Array<Cashback | ICashback> = await this.cashbackModel.find({ userId }).exec();
        cashbacks.forEach(async (cashback) => {
            if (!cashback.limitless) return;

            const { timestamp } = cashback;
            const currentMonth = new Date().getMonth();
            const cashbackMonth = new Date(timestamp).getMonth();
            if (!getIsCashbackExpired(timestamp) && cashbackMonth > currentMonth) return;

            const currentCashbacks = cashbacks.filter(item => {
                return item.name === cashback.name &&
                    item.bank === cashback.bank &&
                    item.percentage === cashback.percentage &&
                    item?.card?.name === cashback?.card?.name;
            });

            let isCurrentMonth = false;
            let isNextMonth = false;
            for (let i = 0; i < currentCashbacks.length; i++) {
                const timestamp = currentCashbacks[i].timestamp;
                if (getIsCashbackExpired(timestamp)) return;

                const cashbackMonth = new Date(timestamp).getMonth();
                const nextMonth = getCashbackNextMonth();
                const currentMonth = new Date().getMonth();

                if (cashbackMonth === currentMonth) {
                    isCurrentMonth = true;
                } else if (cashbackMonth === nextMonth) {
                    isNextMonth = true;
                }

                if (isCurrentMonth && isNextMonth) {
                    break;
                }
            }

            if (!isCurrentMonth) {
                const currentMonthCashbacks = cashbacks.filter(cashback => {
                    const timestamp = cashback.timestamp;
                    const cashbackMonth = new Date(timestamp).getMonth();
                    const currentMonth = new Date().getMonth();
                    return getIsCashbackExpired(timestamp) && cashbackMonth === currentMonth;
                });
                const newCashback = await this.create({
                    userId,
                    card: cashback.card,
                    bank: cashback.bank,
                    icon: cashback.icon,
                    color: cashback.color,
                    name: cashback.name,
                    percentage: cashback.percentage,
                    orderNumber: currentMonthCashbacks.length,
                    bankOrderNumber: getCashbackBankOrderNumber(currentMonthCashbacks as Cashback[], cashback.bank),
                    timestamp: Date.now(),
                });
                cashbacks.push(newCashback);
            }

            if (!isNextMonth) {
                const nextMonthCashbacks = cashbacks.filter(cashback => {
                    const timestamp = cashback.timestamp;
                    const cashbackMonth = new Date(timestamp).getMonth();
                    const nextMonth = getCashbackNextMonth();
                    return getIsCashbackExpired(timestamp) && cashbackMonth === nextMonth;
                });
                const date = new Date();
                date.setMonth(date.getMonth() + 1);
                const newCashback = await this.create({
                    userId,
                    card: cashback.card,
                    bank: cashback.bank,
                    icon: cashback.icon,
                    color: cashback.color,
                    name: cashback.name,
                    percentage: cashback.percentage,
                    orderNumber: nextMonthCashbacks.length,
                    bankOrderNumber: getCashbackBankOrderNumber(nextMonthCashbacks as Cashback[], cashback.bank),
                    timestamp: date.getTime(),
                });
                cashbacks.push(newCashback);
            }
        });
    }

    async findAll(userId: TUserId): Promise<Cashback[]> {
        await this.addTimelessCashbacks(userId);
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
