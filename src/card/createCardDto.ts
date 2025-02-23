import { IsString } from 'class-validator';
import { EBank, TUserId } from 'cashback-check-types';
import { Prop } from '@nestjs/mongoose';

export class CreateCardDto {
    @IsString()
    @Prop({ required: true })
    readonly bank: EBank;

    @IsString()
    @Prop({ required: true })
    readonly name: string;

    @IsString()
    readonly userId: TUserId;
}
