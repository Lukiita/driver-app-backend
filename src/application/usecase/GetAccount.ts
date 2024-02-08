import { AccountRepository } from '../../infra/repository/AccountRepository';

export class GetAccount {
  constructor(private accountRepository: AccountRepository) { }

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getById(accountId);
    if (!account) throw new Error('Account does not exist');
    return {
      accountId: account.accountId,
      name: account.getName(),
      email: account.getEmail(),
      cpf: account.getCpf(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      carPlate: account.getCarPlate(),
    };
  }
}

type Output = {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate?: string;
}