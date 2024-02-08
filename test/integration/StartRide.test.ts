import { AcceptRide } from '../../src/application/usecase/AcceptRide';
import { GetRide } from '../../src/application/usecase/GetRide';
import { RequestRide } from '../../src/application/usecase/RequestRide';
import { Signup } from '../../src/application/usecase/Signup';
import { StartRide } from '../../src/application/usecase/StartRide';
import { DatabaseConnection, PgPromiseAdapter } from '../../src/infra/database/DatabaseConnections';
import MailerGateway from '../../src/infra/gateway/MailerGateway';
import { AccountRepostioryDatabase } from '../../src/infra/repository/AccountRepository';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';

let connection: DatabaseConnection;
let signup: Signup;
let getRide: GetRide;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepostioryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const mailerGateway: MailerGateway = {
    async send(subject: string, recipient: string, message: string): Promise<void> {
    }
  }
  signup = new Signup(accountRepository, mailerGateway);
  requestRide = new RequestRide(rideRepository, accountRepository);
  getRide = new GetRide(rideRepository, accountRepository);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  startRide = new StartRide(rideRepository);
});

afterEach(async () => await connection.close());

test('Deve iniciar uma corrida', async () => {
  const inputSignupPassenger = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  };
  const outputSignupPassenger = await signup.execute(inputSignupPassenger);

  const inputSignupDriver = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isDriver: true,
    carPlate: 'AAA9999'
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);

  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId
  };
  await acceptRide.execute(inputAcceptRide);

  const inputStartRide = {
    rideId: outputRequestRide.rideId
  };
  await startRide.execute(inputStartRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('in_progress');
});