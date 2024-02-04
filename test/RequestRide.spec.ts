import { AccountRepostioryDatabase } from '../src/AccountRepository';
import { DatabaseConnection, PgPromiseAdapter } from '../src/DatabaseConnections';
import { GetRide } from '../src/GetRide';
import { RequestRide } from '../src/RequestRide';
import { RideRepositoryDatabase } from '../src/RideRepository';
import { Signup } from '../src/Signup';

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let signup: Signup;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepostioryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  requestRide = new RequestRide(rideRepository, accountRepository);
  signup = new Signup(accountRepository);
  getRide = new GetRide(rideRepository, accountRepository);
});

afterEach(async () => await connection.close());

test('Não deve solicitar a corrida se o usuário não for um passageiro', async () => {
  const inputSignup = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'FCB4468',
    isDriver: true,
  }
  // when
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  }

  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('User is not a passenger.'));
});

test('Deve solicitar a corrida corretamente', async () => {
  const inputSignup = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  }
  // when
  const outputSignup = await signup.execute(inputSignup);

  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  }

  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const ride = await getRide.execute(outputRequestRide.rideId);
  expect(ride.passengerId).toBe(inputRequestRide.passengerId);
  expect(ride.fromLat).toBe(inputRequestRide.fromLat);
  expect(ride.fromLong).toBe(inputRequestRide.fromLong);
  expect(ride.toLat).toBe(inputRequestRide.toLat);
  expect(ride.toLong).toBe(inputRequestRide.toLong);
  expect(ride.status).toBe('requested');
  expect(ride.date).toBeInstanceOf(Date);
});

test('Não deve solicitar a corrida se o usuário já estiver uma conta ativa', async () => {
  const inputSignup = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  }
  // when
  const outputSignup = await signup.execute(inputSignup);

  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  }

  await requestRide.execute(inputRequestRide);

  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Passenger already has a ride in progress.'));
});