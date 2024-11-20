import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuctionService } from './auction.service';
import { WsJwtAuthGuard } from '../common/guards/socket.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsExceptionFilter } from '../common/exceptions/socket-exception.filter';
import { AuthenticatedSockerUser } from '../common/dto/authenticated-user.dto';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AuctionGateway {
  @WebSocketServer() server: Server;

  constructor(private auctionService: AuctionService) {}

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('joinAuction')
  async handleJoinAuction(
    @ConnectedSocket() client: AuthenticatedSockerUser,
    @MessageBody() payload: object,
  ) {
    try {
      if (!payload || !payload['auctionId']) {
        return {
          event: 'error',
          data: 'Invalid payload',
        };
      }
      client.join(payload['auctionId']);
      const auction = await this.auctionService.getAuctionById(
        payload['auctionId'],
      );

      client.emit('auction-info', auction);

      // Emit the auction info to all clients in the room
      this.server.to(payload['auctionId']).emit('user-joined', {
        message: `${client.user.username} joined the auction`,
      });

      return {
        event: 'auction-info',
        data: auction,
      };
    } catch (error) {
      console.error('Bid error:', error.message);

      client.emit('bidError', { message: error.message });
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('placeBid')
  async handlePlaceBid(
    @ConnectedSocket() client: AuthenticatedSockerUser,
    @MessageBody()
    payload: { auctionId: string; amount: number },
  ) {
    try {
      const { auctionId, amount } = payload;

      if (!auctionId || !amount) {
        throw new Error('Invalid payload');
      }

      await this.auctionService.placeBid(auctionId, client.user.id, amount);

      this.server.to(auctionId).emit('bidPlaced', {
        message: `User ${client.user.username} placed bid successfully at $${amount}`,
      });
    } catch (error) {
      console.error('Bid error:', error.message);

      client.emit('error', { message: error.message });
      return { success: false, error: error.message };
    }
  }
}
