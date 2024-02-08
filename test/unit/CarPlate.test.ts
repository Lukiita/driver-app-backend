import { CarPlate } from '../../src/domain/vo/CarPlate';

describe('CarPlate', () => {
  test('should create a valid car plate', () => {
    const carPlateValue = 'ABC1234';
    const carPlate = new CarPlate(carPlateValue);

    expect(carPlate.getValue()).toBe(carPlateValue);
  });

  test('should throw an error for an invalid car plate', () => {
    const invalidCarPlateValue = '1234';

    expect(() => new CarPlate(invalidCarPlateValue)).toThrow('Invalid car plate');
  });
});