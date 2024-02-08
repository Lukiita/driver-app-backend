import { GetAccount } from '../../src/application/usecase/GetAccount';
import { Signup } from '../../src/application/usecase/Signup';
import { DatabaseConnection, PgPromiseAdapter } from '../../src/infra/database/DatabaseConnections';
import MailerGateway from '../../src/infra/gateway/MailerGateway';
import { AccountRepostioryDatabase } from '../../src/infra/repository/AccountRepository';

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepostioryDatabase(connection);
  const mailerGateway: MailerGateway = {
    async send(subject: string, recipient: string, message: string): Promise<void> {
    }
  }
  signup = new Signup(accountRepository, mailerGateway);
  getAccount = new GetAccount(accountRepository);
});

afterEach(async () => await connection.close());

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
  expect(outputGetAccount.getName()).toBe(input.name);
  expect(outputGetAccount.getEmail()).toBe(input.email);
  expect(outputGetAccount.getCpf()).toBe(input.cpf);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
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
  expect(outputGetAccount.getName()).toBe(input.name);
  expect(outputGetAccount.getEmail()).toBe(input.email);
  expect(outputGetAccount.getCpf()).toBe(input.cpf);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
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

// test("Deve criar a conta de um passageiro stub", async function () {
//   const input = {
//     name: "John Doe",
//     email: `john.doe${Math.random()}@gmail.com`,
//     cpf: "97456321558",
//     isPassenger: true
//   };
//   const saveStub = sinon.stub(AccountRepostioryDatabase.prototype, "save").resolves();
//   const getByEmailStub = sinon.stub(AccountRepostioryDatabase.prototype, "getByEmail").resolves();
//   const getByIdStub = sinon.stub(AccountRepostioryDatabase.prototype, "getById").resolves(input as any);
//   const outputSignup = await signup.execute(input);
//   expect(outputSignup.accountId).toBeDefined();
//   const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//   expect(outputGetAccount.getName()).toBe(input.name);
//   expect(outputGetAccount.email).toBe(input.email);
//   expect(outputGetAccount.cpf).toBe(input.cpf);
//   saveStub.restore();
//   getByEmailStub.restore();
//   getByIdStub.restore();
// });

/* test("Deve criar a conta de um passageiro spy", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true
  };
  const saveSpy = sinon.spy(AccountRepostioryDatabase.prototype, "save");
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(saveSpy.calledOnce).toBe(true);
  expect(sendSpy.calledOnce).toBe(true);
  expect(sendSpy.calledWith("Welcome", input.email, "Use this link to confirm your account"));
  saveSpy.restore();
  sendSpy.restore();
});

test("Deve criar a conta de um passageiro mock", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true
  };
  const mailerGatewayMock = sinon.mock(MailerGateway.prototype)
    .expects("send")
    .withArgs("Welcome", input.email, "Use this link to confirm your account")
    .once();
  const outputSignup = await signup.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  mailerGatewayMock.verify();
}); */