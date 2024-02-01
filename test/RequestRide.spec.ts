import { AccountDAOInMemory } from '../src/AccountDAO';
import { GetRide } from '../src/GetRide';
import { RequestRide } from '../src/RequestRide';
import { RideDaoInMemory } from '../src/RideDAO';
import { Signup } from '../src/Signup';

let requestRide: RequestRide;
let getRide: GetRide;
let signup: Signup;

beforeEach(() => {
  const accountDAO = new AccountDAOInMemory();
  const rideDao = new RideDaoInMemory();
  requestRide = new RequestRide(rideDao, accountDAO);
  signup = new Signup(accountDAO);
  getRide = new GetRide(rideDao);
});

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
    from_lat: 13214,
    from_long: 123213,
    to_lat: 13214,
    to_long: 123213,
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
    from_lat: 13214,
    from_long: 123213,
    to_lat: 13214,
    to_long: 123213,
  }

  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const ride = await getRide.execute(outputRequestRide.rideId);
  expect(ride.passenger_id).toBe(inputRequestRide.passengerId);
  expect(ride.from_lat).toBe(inputRequestRide.from_lat);
  expect(ride.from_long).toBe(inputRequestRide.from_long);
  expect(ride.to_lat).toBe(inputRequestRide.to_lat);
  expect(ride.to_long).toBe(inputRequestRide.to_long);
  expect(ride.status).toBe('requested');
  expect(ride.date).toBeInstanceOf(Date);
});

test.only('Não deve solicitar a corrida se o usuário já estiver uma conta ativa', async () => {
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
    from_lat: 13214,
    from_long: 123213,
    to_lat: 13214,
    to_long: 123213,
  }

  await requestRide.execute(inputRequestRide);

  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Passenger already has a ride in progress.'));
});