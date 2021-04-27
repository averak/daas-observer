import { Dajare, DajareService } from "./";

export class DajareRepository {
  sheet;

  constructor() {
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("dajare");
  }

  public store(dajare: Dajare): void {
    this.sheet?.appendRow(DajareService.toArray(dajare));
  }
}
