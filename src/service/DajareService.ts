import { DajareModel } from "../model";
import { DajareClient } from "../client";
import { DajareRepository } from "../repository";
import { LogUtil } from "../util";

export class DajareService {
  private dajareClient: DajareClient;
  private dajareRepository: DajareRepository;

  constructor() {
    this.dajareClient = new DajareClient();
    this.dajareRepository = new DajareRepository();
  }

  fetchInfo(dajare: DajareModel): DajareModel {
    // use DaaS
    try {
      dajare = this.dajareClient.judgeDajare(dajare);
      dajare = this.dajareClient.evalDajare(dajare);
      dajare = this.dajareClient.readingDajare(dajare);
    } catch (e) {
      dajare.setIsDajare(false);
      dajare.setScore(1.0);
      dajare.setReading("");
      LogUtil.logging("failed to connect DaaS", "ERROR");
    }

    return dajare;
  }

  fetchDajare(num: number): DajareModel[] {
    const result: DajareModel[] = [];
    const dajareList = this.dajareRepository.findAll();

    // pick out only dajare
    for (let i = 0; i < dajareList.length; i++) {
      if (dajareList[i].getIsDajare()) {
        result.push(dajareList[i]);
      }
    }

    return result.slice(0, num);
  }

  store(dajare: DajareModel): void {
    this.dajareRepository.store(dajare);
  }
}
