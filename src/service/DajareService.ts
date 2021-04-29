import { DajareModel } from "../model";
import { DajareClient } from "../client";
import { DajareRepository } from "../repository";
import { SlackUtil } from "../util";

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
      SlackUtil.logging("failed to connect DaaS", "ERROR");
    }

    return dajare;
  }

  store(dajare: DajareModel): void {
    this.dajareRepository.store(dajare);
  }
}
