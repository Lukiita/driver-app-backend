import { AccountDAO } from './AccountDAO';

export class GetAccount {
  constructor(private accountDAO: AccountDAO) { }

  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    account.isDriver = account.is_driver;
    account.isPassenger = account.is_passenger;
    return account;
  }
}