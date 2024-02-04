import express from 'express';
import { AccountRepostioryDatabase } from './AccountRepository';
import { GetAccount } from './GetAccount';
import { GetRide } from './GetRide';
import { RequestRide } from './RequestRide';
import { RideRepositoryDatabase } from './RideRepository';
import { Signup } from './Signup';

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
  const accountDAO = new AccountRepostioryDatabase();
  const signup = new Signup(accountDAO);
  const output = await signup.execute(req.body);
  res.json(output);
});

app.get('/accounts/:accountId', async (req, res) => {
  const accountRepository = new AccountRepostioryDatabase();
  const getAccount = new GetAccount(accountRepository);
  const output = await getAccount.execute(req.params.accountId);
  res.json(output);
});

app.post('/request_ride', async (req, res) => {
  const accountRepository = new AccountRepostioryDatabase();
  const rideRepository = new RideRepositoryDatabase();
  console.log(req.body);
  const requestRide = new RequestRide(rideRepository, accountRepository);
  const output = await requestRide.execute(req.body);
  res.json(output);
});

app.get('/rides/:rideId', async (req, res) => {
  const rideRepository = new RideRepositoryDatabase();
  const accountRepository = new AccountRepostioryDatabase();
  const signup = new GetRide(rideRepository, accountRepository);
  const output = await signup.execute(req.params.rideId);
  res.json(output);
});

app.listen(3000);