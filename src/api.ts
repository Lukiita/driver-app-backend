import express from 'express';
import { AccountDAODatabase } from './AccountDAO';
import { GetAccount } from './GetAccount';
import { Signup } from './Signup';

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
  const accountDAO = new AccountDAODatabase();
  const signup = new Signup(accountDAO);
  const output = await signup.execute(req.body);
  res.json(output);
});

app.get('/accounts/:accountId', async (req, res) => {
  const accountDAO = new AccountDAODatabase();
  const getAccount = new GetAccount(accountDAO);
  const output = await getAccount.execute(req.params.accountId);
  res.json(output);
});
app.listen(3000);