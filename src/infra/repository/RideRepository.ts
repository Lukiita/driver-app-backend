import { Ride } from '../../domain/entity/Ride';
import { DatabaseConnection } from '../database/DatabaseConnections';

export interface RideRepository {
  save(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride | undefined>;
  getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
  update(ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {

  constructor(private readonly connection: DatabaseConnection) { }

  async save(ride: Ride) {
    await this.connection.query("insert into cccat15.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date, last_lat, last_long, distance) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [ride.rideId, ride.passengerId, ride.getStatus(), ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.date, ride.getLastLat(), ride.getLastLong(), ride.getDistance()]);
  }

  async update(ride: Ride): Promise<void> {
    await this.connection.query("update cccat15.ride set status = $1, driver_id = $2, last_lat = $3, last_long = $4, distance = $5 where ride_id = $6", [ride.getStatus(), ride.getDriverId(), ride.getLastLat(), ride.getLastLong(), ride.getDistance(), ride.rideId]);
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    const [ride] = await this.connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);
    if (!ride) return;
    return Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date, parseFloat(ride.last_lat), parseFloat(ride.last_long), parseFloat(ride.distance), ride.driver_id);
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]> {
    const activeRides = await this.connection.query("select * from cccat15.ride where passenger_id = $1 and status = 'requested'", [passengerId]);
    return activeRides.map((ride: any) => Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date, parseFloat(ride.last_lat), parseFloat(ride.last_long), parseFloat(ride.distance), ride.driver_id));
  }

  async getActiveRidesByDriverId(driverId: string): Promise<Ride[]> {
    const activeRides = await this.connection.query("select * from cccat15.ride where passenger_id = $1 and status = 'accepted'", [driverId]);
    return activeRides.map((ride: any) => Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date, parseFloat(ride.last_lat), parseFloat(ride.last_long), parseFloat(ride.distance), ride.driver_id));
  }
}

export class RideRepositoryInMemory implements RideRepository {
  private readonly rides: any[] = [];

  async save(ride: any) {
    this.rides.push(ride);
  }

  update(ride: Ride): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    return this.rides.find(r => r.rideId === rideId);
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]> {
    return this.rides.filter(r => r.passengerId === passengerId && r.status !== 'completed');
  }
}