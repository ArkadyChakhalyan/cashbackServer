import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ECashbacksView, ISettings } from 'cashback-check-types';

@Schema()
export class User extends Document {
    @Prop({ required: false })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    picture: string;

    @Prop({ required: false })
    cashbacksView?: ECashbacksView;

    @Prop({ required: false })
    seenStories?: number[];

    @Prop({ required: false })
    settings?: ISettings;
}

export const UserSchema = SchemaFactory.createForClass(User);
