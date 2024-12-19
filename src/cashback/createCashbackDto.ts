import { IsNumber, IsString } from 'class-validator';
import { EBank, ECashbackColor } from 'cashback-check-types/cashback';
import { TUserId } from 'cashback-check-types/user';
import { Prop } from '@nestjs/mongoose';

export class CreateCashbackDto {
    @IsString()
    readonly bank: EBank;

    @IsString()
    readonly color: ECashbackColor;

    @IsString()
    readonly icon: string;

    @IsString()
    readonly name: string;

    @IsNumber()
    readonly percentage: number;

    @Prop({ required: true })
    orderNumber: number;

    @Prop({ required: true })
    bankOrderNumber: number;

    @IsNumber()
    readonly timestamp: number;

    @IsString()
    readonly userId: TUserId;
}
