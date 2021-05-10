import { LogUtil } from "./util";
import { SlackEventsController, FetchDajareController } from "./api";

declare const global: {
  [x: string]: any;
};

// api controllers
const slackEventsController = new SlackEventsController();
const fetchDajareController = new FetchDajareController();

// get paramater
interface GetRequest {
  action: string;
}

global.doGet = (
  e: GoogleAppsScript.Events.DoGet
): GoogleAppsScript.Content.TextOutput => {
  let result: GoogleAppsScript.Content.TextOutput;

  // routing
  const params: GetRequest = e.parameter as GetRequest;
  switch (params.action) {
    case undefined:
      result = ContentService.createTextOutput("action param is not specified");
      break;

    case "fetchDajare":
      result = fetchDajareController.fetchDajare(e);
      break;

    case "ranking":
      result = fetchDajareController.fetchRanking(e);
      break;

    default:
      result = ContentService.createTextOutput("action is not allowed");
      break;
  }

  LogUtil.logging("API called from browser", "INFO");
  return result;
};

global.doPost = (
  e: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput => {
  return slackEventsController.slackEventSubmit(e);
};
