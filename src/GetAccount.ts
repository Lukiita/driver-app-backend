import { AccountRepository } from './AccountRepository';

export class GetAccount {
  constructor(private accountRepository: AccountRepository) { }

  async execute(accountId: string) {
    const account = await this.accountRepository.getById(accountId);
    if (!account) throw new Error('Account does not exist');
    return account;
  }
}