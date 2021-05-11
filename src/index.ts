import { LogUtil, DialogUtil } from "./util";
import { SlackEventsController, FetchDajareController } from "./api";
import { SlackEventRepository } from "./repository";

declare const global: {
  [x: string]: any;
};

// api controllers
const slackEventsController = new SlackEventsController();
const fetchDajareController = new FetchDajareController();

// GET request paramater
interface GetRequest {
  action: "dajare" | "ranking";
}

// POST request paramater
interface PostRequest {
  service: "slack" | "discord";
  command: string;
}

global.doGet = (
  e: GoogleAppsScript.Events.DoGet
): GoogleAppsScript.Content.TextOutput => {
  let result: GoogleAppsScript.Content.TextOutput;

  // routing
  const params: GetRequest = e.parameter as GetRequest;
  switch (params.action) {
    case "dajare":
      result = fetchDajareController.fetchDajare(e);
      break;

    case "ranking":
      result = fetchDajareController.fetchRanking(e);
      break;

    default:
      result = ContentService.createTextOutput("action is not allowed");
      break;
  }

  return result;
};

global.doPost = (
  e: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  let result: GoogleAppsScript.Content.TextOutput;

  // routing
  const params: PostRequest = e.parameter as PostRequest;
  switch (params.service) {
    case "slack":
      if (params.command == undefined) {
        result = slackEventsController.slackMessageEvent(e);
      } else {
        result = slackEventsController.slackSlashCommand(e, params.command);
      }
      break;

    case "discord":
      LogUtil.logging("discord", "DEBUG");
      result = ContentService.createTextOutput("service is not allowed");
      break;

    default:
      LogUtil.logging("other", "DEBUG");
      result = ContentService.createTextOutput("service is not allowed");
      break;
  }

  return result;
};

// clear sheet button
global.clearLog = () => {
  DialogUtil.yesno("ログを削除しますか？", () => {
    LogUtil.clearAll();
  });
};
global.clearEventLog = () => {
  DialogUtil.yesno("イベントログを削除しますか？", () => {
    const slackEventRepository = new SlackEventRepository();
    slackEventRepository.clearAll();
  });
};
