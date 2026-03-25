import { IsString } from 'class-validator';
import { EBank, TUserId } from 'cashback-check-types';

export class CreateCardDto {
    @IsString()
    readonly bank: EBank;

    @IsString()
    readonly name: string;

    @IsString()
    readonly userId: TUserId;
}
