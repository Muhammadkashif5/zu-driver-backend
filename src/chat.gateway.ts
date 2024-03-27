import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  private drivers: { latitude: number, longitude: number, name: string, bus: string }[] = [];

  @SubscribeMessage('driverLocation')
  handleDriverLocation(client: Socket, data: {
    latitude: number;
    longitude: number;
    name: string;
    bus: string;
  }) {
    const existingDriverIndex = this.drivers.findIndex(driver => driver.bus === data.bus);
    if (existingDriverIndex !== -1) {
      this.drivers[existingDriverIndex].latitude = data.latitude;
      this.drivers[existingDriverIndex].longitude = data.longitude;
    } else {
      if (data.name) this.drivers.push(data);
    }

    // console.log("data", data)
    // console.log(" this.drivers",  this.drivers)
    
    this.server.emit('driverLocationUpdate', this.drivers);
  }
}
