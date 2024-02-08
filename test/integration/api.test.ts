
import axios from 'axios';

test("Deve criar a conta de um passageiro", async function () {
  const input = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true
  };
  const responseSignup = await axios.post("http://localhost:3000/signup", input);
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve solicitar uma corrida", async function () {
  const inputSignup = {
    name: 'Lucas Fernandes',
    email: `lucas.lima${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', inputSignup);
  const outputSignup = responseSignup.data;
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476
  }
  const responseRequestRide = await axios.post('http://localhost:3000/request_ride', inputRequestRide);
  const outputRequestRide = responseRequestRide.data;
  expect(outputRequestRide.rideId).toBeDefined();
  const repopnseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
  const outputGetRide = repopnseGetRide.data;
  expect(responseRequestRide.status).toBe(200);
  expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
  expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
  expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
  expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
});