import { DajareModel } from "../model";
import { SHEET_NAME } from "../config";
import { AbstractRepository } from "./AbstractRepository";

export class DajareRepository extends AbstractRepository {
  onInit(): void {
    this.loadSheet(SHEET_NAME.dajare);
  }

  store(dajare: DajareModel): void {
    this.sheet?.appendRow([
      new Date(),
      dajare.getText(),
      dajare.getScore(),
      dajare.getIsDajare(),
      dajare.getAuthorName(),
    ]);
  }

  findAll(): DajareModel[] {
    const result: DajareModel[] = [];

    // range settings
    const START_COL = 2;
    const START_ROW = 2;
    const END_COL = 5;
    const END_ROW = this.sheet?.getLastRow() || START_ROW;

    // get active cells
    const cells: string[][] | undefined = this.sheet?.getSheetValues(
      START_ROW,
      START_COL,
      END_ROW,
      END_COL
    );
    if (cells == undefined) {
      return result;
    }

    for (let i = 0; i < END_ROW; i++) {
      // text is empty
      if (cells[i][0] == "") {
        continue;
      }

      const dajare = new DajareModel(cells[i][0]);
      dajare.setScore(Number(cells[i][1]));
      dajare.setIsDajare(Boolean(cells[i][2]));
      dajare.setAuthorName(cells[i][3]);
      result.push(dajare);
    }

    return result;
  }
}
