import { RideDAO } from './RideDAO';

export class GetRide {
  constructor(private rideDAO: RideDAO) { }

  async execute(accountId: string) {
    const ride = await this.rideDAO.getById(accountId);
    ride.passengerId = ride.passenger_id;
    ride.driverId = ride.driver_id;
    ride.fromLat = ride.from_lat;
    ride.fromLong = ride.from_long;
    ride.toLat = ride.to_lat;
    ride.toLong = ride.to_long;
    return ride;
  }
}