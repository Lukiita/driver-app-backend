import { Name } from '../../src/domain/vo/Name';

describe('Name', () => {
  test('should create a valid name', () => {
    const nameValue = 'John Doe';
    const name = new Name(nameValue);

    expect(name.getValue()).toBe(nameValue);
  });

  test.each([
    'John123',
    'JohnDoe',
    'John@Doe',
    '',
    null,
    undefined
  ])('Deve testar se o nome é inválido: %s', (name: any) => {
    expect(() => new Name(name)).toThrow('Invalid name');
  });
});