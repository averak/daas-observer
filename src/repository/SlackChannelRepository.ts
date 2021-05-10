import { SlackChannelModel } from "../model";
import { SHEET_NAME } from "../config";

import { AbstractRepository } from "./AbstractRepository";

export class SlackChannelRepository extends AbstractRepository {
  onInit(): void {
    this.loadSheet(SHEET_NAME.slack_channel);
  }

  findById(id: string): SlackChannelModel | undefined {
    let result: SlackChannelModel | undefined;
    const channels = this.findAll();

    // find by id
    for (let i = 0; i < channels.length; i++) {
      if (id == channels[i].getId()) {
        result = channels[i];
      }
    }

    return result;
  }

  findByName(name: string): SlackChannelModel | undefined {
    let result: SlackChannelModel | undefined;
    const channels = this.findAll();

    // find by id
    for (let i = 0; i < channels.length; i++) {
      if (name == channels[i].getName()) {
        result = channels[i];
      }
    }

    return result;
  }

  findAll(): SlackChannelModel[] {
    const result: SlackChannelModel[] = [];

    // range settings
    const START_COL = 1;
    const START_ROW = 2;
    const END_COL = 4;
    const END_ROW = 100;

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
      // blank row -> break
      if (cells[i][0] == "") {
        break;
      }

      const slackChannel = new SlackChannelModel(cells[i][0]);
      slackChannel.setName(cells[i][1]);
      slackChannel.setWebhookURL(cells[i][3]);

      result.push(slackChannel);
    }

    return result;
  }
}
