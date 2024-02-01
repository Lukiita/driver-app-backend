
import axios from 'axios';

test("Deve criar a conta de motorista", async function () {
  // given
  const input = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'FCB4468',
    isDriver: true,
  }
  // when
  const responseSignup = await axios.post('http://localhost:3000/signup', input);
  const outputSignup = responseSignup.data;
  // then
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.is_driver).toBe(input.isDriver);
});