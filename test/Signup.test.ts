import { AccountDAOInMemory } from '../src/AccountDAO';
import { GetAccount } from '../src/GetAccount';
import { Signup } from '../src/Signup';

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDAO = new AccountDAOInMemory();
  signup = new Signup(accountDAO);
  getAccount = new GetAccount(accountDAO);
})

test("Deve criar a conta de um passageiro", async function () {
  // given
  const input = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  }
  // when
  const outputSignup = await signup.execute(input);
  // then
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test("Deve criar a conta de motorista", async function () {
  // given
  const input = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'FCB4468',
    isDriver: true,
  }
  // when
  const outputSignup = await signup.execute(input);
  // then
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.is_driver).toBe(input.isDriver);
});

test("Não deve criar um passageiro se o nome for inválido", async function () {
  // given
  const input = {
    name: 'Lucas',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  }
  // when
  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid name'));
});

test("Não deve criar um passageiro se o email for inválido", async function () {
  // given
  const input = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}`,
    cpf: '97456321558',
    isPassenger: true,
  }
  // when
  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid email'));
});

test("Não deve criar um passageiro se o CPF for inválido", async function () {
  // given
  const input = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: 'invalid',
    isPassenger: true,
  }
  // when
  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid CPF'));
});

test("Não deve criar um passageiro se a conta já existe", async function () {
  // given
  const input = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  }
  // when
  await signup.execute(input);
  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Account already exists'));
});

test("Não deve criar um motorista se a placa for inválida", async function () {
  // given
  const input = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'invalid',
    isDriver: true,
  }
  // when
  await expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid car plate'));
});