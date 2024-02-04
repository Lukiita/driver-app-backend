import { AccountRepository } from './AccountRepository';
import { RideRepository } from './RideRepository';

export class GetRide {
  constructor(private rideDAO: RideRepository, private readonly accountRepository: AccountRepository) { }

  async execute(accountId: string): Promise<Output> {
    const ride = await this.rideDAO.getById(accountId);
    if (!ride) throw new Error('Ride does not exist');
    const passenger = await this.accountRepository.getById(ride.passengerId);
    if (!passenger) throw new Error('Passenger does not exist');
    return {
      passengerId: ride.passengerId,
      passengerName: passenger.name,
      rideId: ride.rideId,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      status: ride.status,
      date: ride.date,
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
  date: Date;
}