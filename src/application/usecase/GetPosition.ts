import { PositionRepository } from '../../infra/repository/PositionRepository';

export class GetPositions {
  constructor(private positionRepository: PositionRepository) { }

  async execute(rideId: string): Promise<Output[]> {
    const positions = await this.positionRepository.listByRideId(rideId);
    return positions.map((position) => {
      return {
        positionId: position.positionId,
        rideId: position.rideId,
        lat: position.getLat(),
        long: position.getLong(),
        date: position.date,
      };
    })
  }
}

type Output = {
  positionId: string;
  rideId: string;
  lat: number;
  long: number;
  date: Date;
}