import { SlackEventModel } from "../model";
import { SHEET_NAME } from "../config";
import { AbstractRepository } from "./AbstractRepository";

export class SlackEventRepository extends AbstractRepository {
  onInit(): void {
    this.loadSheet(SHEET_NAME.slack_event);
  }

  store(slackEvent: SlackEventModel): void {
    this.sheet?.appendRow([
      slackEvent.getTimestamp(),
      slackEvent.getId(),
      slackEvent.getType(),
      slackEvent.getChannelId(),
      slackEvent.getUserId(),
      slackEvent.getMessage(),
    ]);
  }

  findAll(): SlackEventModel[] {
    const result: SlackEventModel[] = [];

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
      // event id is empty
      if (cells[i][0] == "") {
        continue;
      }

      const slackEvent = new SlackEventModel(cells[i][0]);
      slackEvent.setType(cells[i][1]);
      slackEvent.setChannelId(cells[i][2]);
      slackEvent.setUserId(cells[i][3]);
      slackEvent.setMessage(cells[i][4]);
      result.push(slackEvent);
    }

    return result;
  }

  exists(slackEvent: SlackEventModel): boolean {
    const slackEventList: SlackEventModel[] = this.findAll();
    for (let i = 0; i < slackEventList.length; i++) {
      if (slackEvent.equals(slackEventList[i])) {
        return true;
      }
    }
    return false;
  }

  clearAll(): void {
    // range settings
    const START_COL = 1;
    const START_ROW = 2;
    const END_COL = 6;
    const END_ROW = this.sheet?.getLastRow() || START_ROW;

    this.sheet?.getRange(START_ROW, START_COL, END_ROW, END_COL).clearContent();
  }
}
