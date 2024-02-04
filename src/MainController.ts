import { GetAccount } from './GetAccount';
import { GetRide } from './GetRide';
import { HttpServer } from './HttpServer';
import { RequestRide } from './RequestRide';
import { Signup } from './Signup';

export class MainController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly signup: Signup,
    private readonly getAccount: GetAccount,
    private readonly requestRide: RequestRide,
    private readonly getRide: GetRide
  ) {
    httpServer.register('post', '/signup', async (params: any, body: any) => {
      const output = await signup.execute(body);
      return output;
    });

    httpServer.register('get', '/accounts/:accountId', async (params: any, body: any) => {
      const output = await getAccount.execute(params.accountId);
      return output;
    });

    httpServer.register('post', '/request_ride', async (params: any, body: any) => {
      console.log(body);
      const output = await requestRide.execute(body);
      return output;
    });

    httpServer.register('get', '/rides/:rideId', async (params: any, body: any) => {
      const output = await getRide.execute(params.rideId);
      return output;
    });
  }
}