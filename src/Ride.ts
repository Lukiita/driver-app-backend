export default class Ride {

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly status: string,
    readonly date: Date,
  ) { }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {

  }
}