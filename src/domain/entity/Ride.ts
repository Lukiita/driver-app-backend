import crypto from 'crypto';
import DistanceCalculator from '../ds/DistanceCalculator';
import { Coord } from '../vo/Coord';

const PRICE_PER_KM = 2.1;

export class Ride {
  private from: Coord;
  private to: Coord;
  private lastPosition: Coord;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    private status: string,
    readonly date: Date,
    lastLat: number,
    lastLong: number,
    private distance: number,
    private fare: number,
    private driverId?: string,
  ) {
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
    this.lastPosition = new Coord(lastLat, lastLong);
  }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID();
    const status = 'requested';
    const date = new Date();

    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
      fromLat,
      fromLong,
      0,
      0,
    );
  }

  static restore(
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
    lastLat: number,
    lastLong: number,
    distance: number,
    fare: number,
    driverId?: string
  ) {
    return new Ride(
      rideId,
      passengerId,
      fromLat,
      fromLong,
      toLat,
      toLong,
      status,
      date,
      lastLat,
      lastLong,
      distance,
      fare,
      driverId,
    );
  }

  accept(driverId: string) {
    if (this.status !== 'requested') throw new Error('Invalid status.');
    this.status = 'accepted';
    this.driverId = driverId;
  }

  start() {
    if (this.status !== 'accepted') throw new Error('Invalid status.');
    this.status = 'in_progress';
  }

  finish() {
    if (this.status !== 'in_progress') throw new Error('Invalid status.');
    this.status = 'completed';
    this.fare = this.distance * PRICE_PER_KM;
  }

  updatePosition(lat: number, long: number) {
    if (this.status !== 'in_progress') throw new Error('Invalid status.');
    const newLastPosition = new Coord(lat, long);
    this.distance += DistanceCalculator.calculate(this.lastPosition, newLastPosition);
    this.lastPosition = newLastPosition;
  }

  getStatus() {
    return this.status;
  }

  getDriverId() {
    return this.driverId;
  }

  getFromLat() {
    return this.from.getLat();
  }

  getFromLong() {
    return this.from.getLong();
  }

  getToLat() {
    return this.to.getLat();
  }

  getToLong() {
    return this.to.getLong();
  }

  getLastLat() {
    return this.lastPosition.getLat();
  }

  getLastLong() {
    return this.lastPosition.getLong();
  }

  getDistance() {
    return this.distance;
  }

  getFare() {
    return this.fare;
  }
}