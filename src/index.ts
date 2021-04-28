import { SlackEventsController } from "./controller";

declare const global: {
  [x: string]: any;
};

// slack event controller
const slackEventsController = new SlackEventsController();

import { SlackUtil } from "./util";
global.doPost = (
  event: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  SlackUtil.postMessage("personal:log", "helle");
  SlackUtil.logging("this is log");
  return slackEventsController.receiveEvent(event);
};
