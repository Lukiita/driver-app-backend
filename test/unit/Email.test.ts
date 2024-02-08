import { Email } from '../../src/domain/vo/Email';

describe('Email', () => {
  test('should create a valid email', () => {
    const emailValue = 'test@example.com';
    const email = new Email(emailValue);

    expect(email.getValue()).toBe(emailValue);
  });

  test('should throw an error for an invalid email', () => {
    const invalidEmailValue = 'invalidemail';

    expect(() => new Email(invalidEmailValue)).toThrow('Invalid email');
  });
});