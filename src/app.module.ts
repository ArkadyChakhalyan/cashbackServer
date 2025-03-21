import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.modules';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.modules';
import { CashbackModule } from './cashback/cashback.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
      }),
      MongooseModule.forRoot(process.env.DATABASE_URL),
      AuthModule,
      UserModule,
      CashbackModule,
      CardModule,
  ],
})
export class AppModule {}
