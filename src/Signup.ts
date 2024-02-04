import { Account } from './Account';
import { AccountRepository } from './AccountRepository';
import MailerGateway from './MailerGateway';

export class Signup {
  constructor(private accountRepository: AccountRepository) { }

  async execute(input: any) {
    const existingAccount = await this.accountRepository.getByEmail(input.email);
    if (existingAccount) throw new Error('Account already exists');
    const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
    await this.accountRepository.save(account);
    const mailerGateway = new MailerGateway();
    mailerGateway.send("Welcome", input.email, "Use this link to confirm your account");
    return {
      accountId: account.accountId
    };
  }
}