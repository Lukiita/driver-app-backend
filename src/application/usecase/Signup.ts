import { Account } from '../../domain/Account';
import MailerGateway from '../../infra/gateway/MailerGateway';
import { AccountRepository } from '../../infra/repository/AccountRepository';

export class Signup {
  constructor(private accountRepository: AccountRepository, private readonly mailerGateway: MailerGateway) { }

  async execute(input: any) {
    const existingAccount = await this.accountRepository.getByEmail(input.email);
    if (existingAccount) throw new Error('Account already exists');
    const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
    await this.accountRepository.save(account);
    this.mailerGateway.send("Welcome", input.email, "Use this link to confirm your account");
    return {
      accountId: account.accountId
    };
  }
}