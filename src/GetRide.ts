import { RideRepository } from './RideRepository';

export class GetRide {
  constructor(private rideDAO: RideRepository) { }

  async execute(accountId: string): Promise<Output> {
    const ride = await this.rideDAO.getById(accountId);
    if (!ride) throw new Error('Ride does not exist');
    return ride;
  }
}

type Output = {
  passengerId: string;
  rideId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  date: Date;
  status: string;
}