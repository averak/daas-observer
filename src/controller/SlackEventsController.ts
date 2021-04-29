import { SlackService, EventIdService } from "../service";
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
  private eventIdService: EventIdService;

  constructor() {
    this.slackService = new SlackService();
    this.eventIdService = new EventIdService();
  }

  receiveEvent(
    event: GoogleAppsScript.Events.DoPost
  ): GoogleAppsScript.Content.TextOutput {
    const params: postParams = JSON.parse(
      event.postData.contents
    ) as postParams;

    // ignore already received request
    if (this.eventIdService.exists(params.event_id)) {
      return ContentService.createTextOutput("this event is already received");
    } else {
      this.eventIdService.store(params.event_id);
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
