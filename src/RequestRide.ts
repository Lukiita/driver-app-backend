import { AccountDAO } from './AccountDAO';
import { RideDAO } from './RideDAO';

export class RequestRide {
  constructor(
    private readonly rideDAO: RideDAO,
    private readonly accountDao: AccountDAO,
  ) { }

  async execute(input: any) {
    const passenger = await this.accountDao.getById(input.passengerId);
    if (!passenger.isPassenger) {
      throw new Error('User is not a passenger.');
    }

    const rides: any[] = await this.rideDAO.getIncompletedByPassengerId(input.passengerId);
    if (rides.length > 0) {
      throw new Error('Passenger already has a ride in progress.');
    }

    input.rideId = crypto.randomUUID();
    input.status = 'requested';
    input.date = new Date();

    await this.rideDAO.save(input);
    return {
      rideId: input.rideId,
    }
  }
}