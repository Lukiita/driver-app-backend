import { AcceptRide } from '../../src/application/usecase/AcceptRide';
import { FinishRide } from '../../src/application/usecase/FinishRide';
import { GetPositions } from '../../src/application/usecase/GetPosition';
import { GetRide } from '../../src/application/usecase/GetRide';
import { RequestRide } from '../../src/application/usecase/RequestRide';
import { Signup } from '../../src/application/usecase/Signup';
import { StartRide } from '../../src/application/usecase/StartRide';
import { UpdatePosition } from '../../src/application/usecase/UpdatePosition';
import { DatabaseConnection, PgPromiseAdapter } from '../../src/infra/database/DatabaseConnections';
import MailerGateway from '../../src/infra/gateway/MailerGateway';
import { AccountRepostioryDatabase } from '../../src/infra/repository/AccountRepository';
import { PositionRepositoryDatabase } from '../../src/infra/repository/PositionRepository';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';

let connection: DatabaseConnection;
let signup: Signup;
let getRide: GetRide;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let getPositions: GetPositions;
let finishRide: FinishRide;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepostioryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);
  const mailerGateway: MailerGateway = {
    async send(subject: string, recipient: string, message: string): Promise<void> {
    }
  }
  signup = new Signup(accountRepository, mailerGateway);
  requestRide = new RequestRide(rideRepository, accountRepository);
  getRide = new GetRide(rideRepository, accountRepository);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  startRide = new StartRide(rideRepository);
  updatePosition = new UpdatePosition(rideRepository, positionRepository);
  getPositions = new GetPositions(positionRepository);
  finishRide = new FinishRide(rideRepository);
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
  const inputUpdatePosition = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476
  };
  await updatePosition.execute(inputUpdatePosition);
  const inputFinishRide = {
    rideId: outputRequestRide.rideId
  };
  await finishRide.execute(inputFinishRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.fare).toBe(21);
  expect(outputGetRide.status).toBe('completed');
});
