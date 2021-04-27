import { DajareModel } from "../model";

export class DajareRepository {
  private sheet;

  constructor() {
    const sheetApp = SpreadsheetApp.getActive();
    this.sheet = sheetApp.getSheetByName("ダジャレ一覧");
  }

  public store(dajare: DajareModel): void {
    this.sheet?.appendRow([
      dajare.getText(),
      dajare.getReading(),
      dajare.getScore(),
      dajare.getIsDajare(),
      dajare.getAuthor(),
    ]);
  }
}
