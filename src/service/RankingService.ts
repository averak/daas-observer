import { DajareModel } from "../model";
import { DajareRepository } from "../repository";

export class RankingService {
  private dajareRepository: DajareRepository;

  constructor() {
    this.dajareRepository = new DajareRepository();
  }

  getRanking(term: "weekly" | "monthly", num = 10): DajareModel[] {
    let result: DajareModel[] = [];

    switch (term) {
      case "weekly":
        result = this.findDajareForPeriod(7);
        break;
      case "monthly":
        result = this.findDajareForPeriod(31);
        break;
    }

    // sort
    result.sort((a, b) => (a.getScore() < b.getScore() ? 1 : -1));

    return result.slice(0, num);
  }

  private findDajareForPeriod(days: number): DajareModel[] {
    const result: DajareModel[] = [];
    const today = new Date();

    this.dajareRepository.findByIsDajare(true).forEach((dajare) => {
      if ((today.getTime() - dajare.getDate().getTime()) / 86400000 < days) {
        result.push(dajare);
      }
    });

    return result;
  }
}
