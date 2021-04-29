import { SlackEventsController } from "./controller";

declare const global: {
  [x: string]: any;
};

// slack event controller
const slackEventsController = new SlackEventsController();

import { SlackUtil } from "./util";
global.doGet = () => {
  SlackUtil.logging("API called from browser", "INFO");
};

global.doPost = (
  event: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  return slackEventsController.receiveEvent(event);
};
