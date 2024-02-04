import { DatabaseConnection } from './DatabaseConnections';
import { Ride } from './Ride';

export interface RideRepository {
  save(ride: Ride): Promise<void>;
  getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
  getById(rideId: string): Promise<Ride | undefined>;
}

export class RideRepositoryDatabase implements RideRepository {

  constructor(private readonly connection: DatabaseConnection) { }

  async save(ride: Ride) {
    await this.connection.query("insert into cccat15.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.status, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]> {
    const activeRides = await this.connection.query("select * from cccat15.ride where passenger_id = $1 and status = 'requested'", [passengerId]);
    return activeRides.map((ride: any) => Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date));
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    const [ride] = await this.connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);
    if (!ride) return;
    return Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date);
  }
}

export class RideRepositoryInMemory implements RideRepository {
  private readonly rides: any[] = [];

  async save(ride: any) {
    this.rides.push(ride);
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    return this.rides.find(r => r.rideId === rideId);
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]> {
    return this.rides.filter(r => r.passengerId === passengerId && r.status !== 'completed');
  }
}