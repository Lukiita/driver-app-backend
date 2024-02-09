import { RideRepository } from '../../infra/repository/RideRepository';

export class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
  ) { }

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId);
    if (!ride) throw new Error('Ride not found.');

    ride.finish();
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
}