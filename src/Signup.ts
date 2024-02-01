import crypto from "crypto";
import { AccountDAO } from './AccountDAO';
import MailerGateway from './MailerGateway';
import { validateCpf } from "./validateCpf";

export class Signup {
  constructor(private accountDAO: AccountDAO) { }

  async execute(input: any) {
    input.accountId = crypto.randomUUID();
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error('Account already exists');
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name');
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email');
    if (!validateCpf(input.cpf)) throw new Error('Invalid CPF');
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error('Invalid car plate');
    await this.accountDAO.save(input);
    const mailerGateway = new MailerGateway();
    mailerGateway.send("Welcome", input.email, "Use this link to confirm your account");
    return {
      accountId: input.accountId
    };
  }
}