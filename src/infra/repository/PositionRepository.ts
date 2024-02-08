import { Position } from '../../domain/entity/Position';
import { DatabaseConnection } from '../database/DatabaseConnections';

export interface PositionRepository {
  save(position: Position): Promise<void>;
  listByRideId(rideId: string): Promise<Position[]>;
}

export class PositionRepositoryDatabase implements PositionRepository {

  constructor(private readonly connection: DatabaseConnection) { }

  async save(position: Position) {
    await this.connection.query("insert into cccat15.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)", [position.positionId, position.rideId, position.getLat(), position.getLong(), position.date]);
  }

  async listByRideId(rideId: string) {
    const positions = await this.connection.query("select * from cccat15.position where ride_id = $1", [rideId]);
    return positions.map((position: any) => new Position(
      position.position_id,
      position.ride_id,
      parseFloat(position.lat),
      parseFloat(position.long),
      position.date
    ));
  }
}