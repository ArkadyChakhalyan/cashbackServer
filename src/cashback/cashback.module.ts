import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashbackService } from './cashback.service';
import { CashbackController } from './cashback.controller';
import { Cashback, CashbackSchema } from './schemas/cashback.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Cashback.name, schema: CashbackSchema },
        ]),
    ],
    controllers: [CashbackController],
    providers: [CashbackService],
    exports: [CashbackService],
})
export class CashbackModule {}
