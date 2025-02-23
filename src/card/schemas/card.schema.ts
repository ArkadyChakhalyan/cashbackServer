import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EBank, TUserId } from 'cashback-check-types';

@Schema()
export class Card extends Document {
    @Prop({ required: true })
    bank: EBank;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    userId: TUserId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
