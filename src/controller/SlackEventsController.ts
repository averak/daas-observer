import { SlackService } from "../service";
import { LogUtil } from "../util";

interface postParams {
  type: string;
  challenge: string;
  event_id: string;
  event: {
    type: string;
    channel: string;
    user: string;
    text: string;
  };
}

export class SlackEventsController {
  private slackService: SlackService;
  private eventIdList: string[];

  constructor() {
    this.slackService = new SlackService();
    this.eventIdList = [];
  }

  receiveEvent(
    event: GoogleAppsScript.Events.DoPost
  ): GoogleAppsScript.Content.TextOutput {
    const params: postParams = JSON.parse(
      event.postData.contents
    ) as postParams;

    // ignore received request
    if (this.eventIdList.indexOf(params.event_id) != -1) {
      return ContentService.createTextOutput("this event is already received");
    }
    // cache event id
    this.eventIdList.push(params.event_id);
    if (this.eventIdList.length > 10) {
      this.eventIdList.shift();
    }

    // control slack event
    switch (params.type) {
      // Slack Events API verification
      case "url_verification":
        return ContentService.createTextOutput(params.challenge);

      // posted by user
      case "event_callback":
        // event filtering
        if (
          this.slackService.eventFilter(
            params.event.channel,
            params.event.user,
            params.event.text
          )
        ) {
          const logMessage = "this event is not allowed";
          LogUtil.logging(logMessage, "WARN");
          return ContentService.createTextOutput(logMessage);
        }

        // action
        this.slackService.receiveMessage(params.event.user, params.event.text);
        break;
    }

    // logging
    LogUtil.logging(
      `catch slack event {type: ${params.type}, event_id: ${params.event_id}}`,
      "INFO"
    );

    return ContentService.createTextOutput("success to receive event");
  }
}
