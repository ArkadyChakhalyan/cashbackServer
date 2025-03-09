import { IsNumber, IsString } from 'class-validator';
import { EBank, ECashbackColor, ICard } from 'cashback-check-types';
import { TUserId } from 'cashback-check-types';
import { Prop } from '@nestjs/mongoose';

export class CreateCashbackDto {
    @IsString()
    @Prop({ required: true })
    readonly bank: EBank;

    @IsString()
    readonly card: ICard;

    @IsString()
    readonly color: ECashbackColor;

    @IsString()
    readonly icon: string;

    @IsString()
    @Prop({ required: true })
    readonly name: string;

    @IsNumber()
    @Prop({ required: true })
    readonly percentage: number;

    @IsNumber()
    @Prop({ required: true })
    orderNumber: number;

    @IsNumber()
    @Prop({ required: true })
    bankOrderNumber: number;

    @IsNumber()
    @Prop({ required: true })
    readonly timestamp: number;

    @IsString()
    readonly userId: TUserId;
}
