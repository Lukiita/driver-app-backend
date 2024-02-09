import { AccountRepository } from '../../infra/repository/AccountRepository';
import { RideRepository } from '../../infra/repository/RideRepository';

export class GetRide {
  constructor(private rideDAO: RideRepository, private readonly accountRepository: AccountRepository) { }

  async execute(accountId: string): Promise<Output> {
    const ride = await this.rideDAO.getById(accountId);
    if (!ride) throw new Error('Ride does not exist');
    const passenger = await this.accountRepository.getById(ride.passengerId);
    if (!passenger) throw new Error('Passenger does not exist');
    return {
      passengerId: ride.passengerId,
      passengerName: passenger.getName(),
      rideId: ride.rideId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      lastLat: ride.getLastLat(),
      lastLong: ride.getLastLong(),
      distance: ride.getDistance(),
      date: ride.date,
      fare: ride.getFare(),
      driverId: ride.getDriverId(),
    };
  }
}

type Output = {
  passengerId: string;
  passengerName: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  lastLat: number;
  lastLong: number;
  distance: number;
  date: Date;
  fare: number;
  driverId?: string;
}