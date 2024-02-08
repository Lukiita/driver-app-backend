import { Coord } from '../../src/domain/vo/Coord';

describe('Coord', () => {
  test('should create a valid coordinate', () => {
    const lat = 37.7749;
    const long = -122.4194;
    const coord = new Coord(lat, long);

    expect(coord.getLat()).toBe(lat);
    expect(coord.getLong()).toBe(long);
  });

  test('should throw an error for an invalid latitude', () => {
    const invalidLat = -100;
    const long = -122.4194;

    expect(() => new Coord(invalidLat, long)).toThrow('Invalid latitude');
  });

  test('should throw an error for an invalid longitude', () => {
    const lat = 37.7749;
    const invalidLong = 200;

    expect(() => new Coord(lat, invalidLong)).toThrow('Invalid longitude');
  });
});