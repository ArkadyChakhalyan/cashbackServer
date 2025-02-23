import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card, CardSchema } from './schemas/card.schema';
import { CashbackModule } from '../cashback/cashback.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Card.name, schema: CardSchema },
        ]),
        CashbackModule,
    ],
    controllers: [CardController],
    providers: [CardService],
    exports: [CardService],
})
export class CardModule {}
