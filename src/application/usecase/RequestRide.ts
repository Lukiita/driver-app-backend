import { Ride } from '../../domain/entity/Ride';
import { AccountRepository } from '../../infra/repository/AccountRepository';
import { RideRepository } from '../../infra/repository/RideRepository';

export class RequestRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepostiory: AccountRepository,
  ) { }

  async execute(input: Input): Promise<Output> {
    const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
    const account = await this.accountRepostiory.getById(input.passengerId);
    if (!account) throw new Error('User not registered.');

    if (!account.isPassenger) throw new Error('User is not a passenger.');

    const rides: any[] = await this.rideRepository.getActiveRidesByPassengerId(input.passengerId);
    if (rides.length > 0) throw new Error('Passenger already has a ride in progress.');

    await this.rideRepository.save(ride);
    return {
      rideId: ride.rideId,
    }
  }
}

type Input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
}

type Output = {
  rideId: string;
}