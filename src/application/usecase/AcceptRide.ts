import { AccountRepository } from '../../infra/repository/AccountRepository';
import { RideRepository } from '../../infra/repository/RideRepository';

export class AcceptRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepostiory: AccountRepository,
  ) { }

  async execute(input: Input): Promise<void> {
    const [ride, account] = await Promise.all([
      this.rideRepository.getById(input.rideId),
      this.accountRepostiory.getById(input.driverId)
    ]);
    if (!ride) throw new Error('Ride not found.');
    if (!account) throw new Error('User not registered.');
    if (!account.isDriver) throw new Error('User is not a driver.');

    ride.accept(input.driverId);
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
  driverId: string;
}