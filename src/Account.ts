import crypto from 'crypto';
import { validateCpf } from './validateCpf';

export class Account {

  private constructor(readonly accountId: string, readonly name: string, readonly email: string, readonly cpf: string, readonly isPassenger: boolean, readonly isDriver: boolean, readonly carPlate?: string) {
    if (this.isInvalidName()) throw new Error('Invalid name');
    if (this.isInvalidEmail()) throw new Error('Invalid email');
    if (!validateCpf(this.cpf)) throw new Error('Invalid CPF');
    if (this.isInvalidCarPlate()) throw new Error('Invalid car plate');
  }

  static create(name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string) {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
  }

  static restore(accountId: string, name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string) {
    return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
  }

  private isInvalidName() {
    return !this.name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  private isInvalidEmail() {
    return !this.email.match(/^(.+)@(.+)$/);
  }

  private isInvalidCarPlate() {
    return this.isDriver && !this.carPlate?.match(/[A-Z]{3}[0-9]{4}/);
  }
}