import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { HelperModule } from '../common/helper/helper.module';
import { DbModule } from '../common/database-connection/postgres/database.module';
import { AuctionGateway } from './auction.gateway';
import { AuthModule } from '../auth/auth.module';
import { WsJwtAuthGuard } from '../common/guards/socket.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HelperModule,
    DbModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
  ],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionGateway, WsJwtAuthGuard],
})
export class AuctionModule {}
