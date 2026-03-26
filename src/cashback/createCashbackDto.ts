import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { EBank, ECashbackColor, ICard, TUserId } from 'cashback-check-types';

export class CreateCashbackDto {
    @IsString()
    readonly bank: EBank;

    @IsOptional()
    @IsObject()
    readonly card: ICard;

    @IsNumber()
    cardOrderNumber: number;

    @IsString()
    readonly color: ECashbackColor;

    @IsString()
    readonly icon: string;

    @IsString()
    readonly name: string;

    @IsNumber()
    readonly percentage: number;

    @IsNumber()
    orderNumber: number;

    @IsNumber()
    bankOrderNumber: number;

    @IsNumber()
    readonly timestamp: number;

    @IsString()
    readonly userId: TUserId;
}
