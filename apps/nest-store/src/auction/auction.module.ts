import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { HelperModule } from '../common/helper/helper.module';
import { AuctionGateway } from './auction.gateway';
import { WsJwtAuthGuard } from '../common/guards/socket.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    HelperModule,
    DatabaseModule,
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
