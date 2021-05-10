import { EnvModel } from "../model";
import { SHEET_NAME } from "../config";
import { AbstractRepository } from "./AbstractRepository";

export class EnvRepository extends AbstractRepository {
  onInit(): void {
    this.loadSheet(SHEET_NAME.env);
  }

  findAll(): EnvModel[] {
    const result: EnvModel[] = [];

    // range settings
    const START_COL = 1;
    const START_ROW = 2;
    const END_COL = 2;
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
      // name is empty
      if (cells[i][0] == "") {
        continue;
      }

      const env = new EnvModel(cells[i][0], cells[i][1]);
      result.push(env);
    }

    return result;
  }

  findByName(name: string): EnvModel | undefined {
    const envList = this.findAll();

    for (let i = 0; i < envList.length; i++) {
      if (name == envList[i].getName()) {
        return envList[i];
      }
    }
  }
}
