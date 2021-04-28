import { DajareModel } from "../model";
import { DajareClient } from "../client";
import { DajareRepository } from "../repository";

export class DajareService {
  private dajareClient: DajareClient;
  private dajareRepository: DajareRepository;

  constructor() {
    this.dajareClient = new DajareClient();
    this.dajareRepository = new DajareRepository();
  }

  fetchInfo(dajare: DajareModel): DajareModel {
    // use DaaS
    dajare = this.dajareClient.judgeDajare(dajare);
    dajare = this.dajareClient.evalDajare(dajare);
    dajare = this.dajareClient.readingDajare(dajare);

    return dajare;
  }

  store(dajare: DajareModel): void {
    this.dajareRepository.store(dajare);
  }
}
