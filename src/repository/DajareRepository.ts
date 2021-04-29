import { DajareModel } from "../model";
import { DAJARE_SHEET_NAME } from "../config";
import { AbstractRepository } from "./AbstractRepository";

export class DajareRepository extends AbstractRepository {
  onInit(): void {
    this.loadSheet(DAJARE_SHEET_NAME);
  }

  store(dajare: DajareModel): void {
    this.sheet?.appendRow([
      new Date(),
      dajare.getText(),
      dajare.getScore(),
      dajare.getIsDajare(),
      dajare.getAuthor().getName(),
    ]);
  }
}
