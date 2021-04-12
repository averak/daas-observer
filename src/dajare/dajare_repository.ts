import { Dajare } from './dajare';

export class DajareRepository {
  sheet;

  constructor() {
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('dajare');
  }

  public store(dajare: Dajare): void {
    this.sheet?.appendRow([dajare.text, dajare.score]);
  }
}
