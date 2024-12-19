import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EBank, ECashbackColor } from 'cashback-check-types/cashback';
import { TUserId } from 'cashback-check-types/user';

@Schema()
export class Cashback extends Document {
    @Prop({ required: true })
    bank: EBank;

    @Prop({ required: true })
    color: ECashbackColor;

    @Prop({ required: true })
    icon: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    orderNumber: number;

    @Prop({ required: true })
    bankOrderNumber: number;

    @Prop({ required: true })
    percentage: number;

    @Prop({ required: true })
    timestamp: number;

    @Prop({ required: true })
    userId: TUserId;
}

export const CashbackSchema = SchemaFactory.createForClass(Cashback);
