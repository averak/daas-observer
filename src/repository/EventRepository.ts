import { EventModel } from "../model";
import { EVENT_SHEET_NAME } from "../config";
import { AbstractRepository } from "./AbstractRepository";
import { LogUtil } from "../util";

export class EventRepository extends AbstractRepository {
  onInit(): void {
    this.loadSheet(EVENT_SHEET_NAME);
  }

  store(event: EventModel): void {
    this.sheet?.appendRow([
      new Date(),
      event.getId(),
      event.getType(),
      event.getChannelId(),
      event.getUserId(),
      event.getMessage(),
    ]);
  }

  findAll(): EventModel[] {
    const result: EventModel[] = [];

    // range settings
    const START_COL = 2;
    const START_ROW = 2;
    const END_COL = 6;
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
      if (cells[i][0] == "") {
        continue;
      }

      const event = new EventModel(cells[i][0]);
      event.setType(cells[i][1]);
      event.setChannelId(cells[i][2]);
      event.setUserId(cells[i][3]);
      event.setMessage(cells[i][4]);
      result.push(event);
    }

    return result;
  }
}
