import pgp from "pg-promise";

export interface RideDAO {
  save(ride: any): Promise<void>;
  getIncompletedByPassengerId(passengerId: string): Promise<any>;
  getById(rideId: string): Promise<any>;
}

export class RideDAODatabase implements RideDAO {
  async save(ride: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("insert into cccat15.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [ride.rideId, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.formLong, ride.toLat, ride.toLong, ride.date]);
    await connection.$pool.end();
  }

  async getIncompletedByPassengerId(passengerId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const rides = await connection.query("select * from cccat15.ride where passenger_id = $1 and status != 'completed'", [passengerId]);
    await connection.$pool.end();
    return rides;
  }

  async getById(rideId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [ride] = await connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);
    await connection.$pool.end();
    return ride;
  }
}

export class RideDaoInMemory implements RideDAO {
  private readonly rides: any[] = [];

  async save(ride: any) {
    this.rides.push(ride);
  }

  async getById(rideId: string): Promise<any> {
    return this.rides.find(r => r.rideId === rideId);
  }

  async getIncompletedByPassengerId(passengerId: string): Promise<any> {
    return this.rides.filter(r => r.passengerId === passengerId && r.status !== 'completed');
  }
}