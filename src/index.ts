import { LogUtil } from "./util";
import { SlackEventsController } from "./controller";

declare const global: {
  [x: string]: any;
};

// slack event controller
const slackEventsController = new SlackEventsController();

global.doGet = (): GoogleAppsScript.Content.TextOutput => {
  LogUtil.logging("API called from browser", "INFO");
  return ContentService.createTextOutput("This API does not support GET");
};

global.doPost = (
  event: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  return slackEventsController.receiveEvent(event);
};
