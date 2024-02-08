import { Account } from './Account';

describe('Account', () => {
  test('should create an account with passenger role', () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const cpf = '97456321558';
    const isPassenger = true;
    const isDriver = false;

    const account = Account.create(name, email, cpf, isPassenger, isDriver);

    expect(account.getName()).toBe(name);
    expect(account.getEmail()).toBe(email);
    expect(account.getCpf()).toBe(cpf);
    expect(account.getCarPlate()).toBeUndefined();
    expect(account.isPassenger).toBe(true);
    expect(account.isDriver).toBe(false);
  });

  test('should create an account with driver role and car plate', () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const cpf = '97456321558';
    const isPassenger = false;
    const isDriver = true;
    const carPlate = 'ABC1234';

    const account = Account.create(name, email, cpf, isPassenger, isDriver, carPlate);

    expect(account.getName()).toBe(name);
    expect(account.getEmail()).toBe(email);
    expect(account.getCpf()).toBe(cpf);
    expect(account.getCarPlate()).toBe(carPlate);
    expect(account.isPassenger).toBe(false);
    expect(account.isDriver).toBe(true);
  });

  test('should restore an account', () => {
    const accountId = '123456';
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const cpf = '97456321558';
    const isPassenger = true;
    const isDriver = false;

    const account = Account.restore(accountId, name, email, cpf, isPassenger, isDriver);

    expect(account.accountId).toBe(accountId);
    expect(account.getName()).toBe(name);
    expect(account.getEmail()).toBe(email);
    expect(account.getCpf()).toBe(cpf);
    expect(account.getCarPlate()).toBeUndefined();
    expect(account.isPassenger).toBe(true);
    expect(account.isDriver).toBe(false);
  });

  test('should set and get account name', () => {
    const account = Account.create('John Doe', 'john.doe@example.com', '97456321558', true, false);

    const newName = 'Jane Smith';
    account.setName(newName);

    expect(account.getName()).toBe(newName);
  });

  test('should set and get account email', () => {
    const account = Account.create('John Doe', 'john.doe@example.com', '97456321558', true, false);

    const newEmail = 'jane.smith@example.com';
    account.setEmail(newEmail);

    expect(account.getEmail()).toBe(newEmail);
  });
});