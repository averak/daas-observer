import { SlackService } from "../service";

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
    if (this.eventIdList.includes(params.event_id)) {
      return ContentService.createTextOutput("this event is already received");
    }
    // cache event id
    this.eventIdList.push(params.event_id);
    if (this.eventIdList.length > 10) {
      this.eventIdList.shift();
    }

    switch (params.type) {
      // Slack Events API verification
      case "url_verification":
        return ContentService.createTextOutput(params.challenge);

      // posted by user
      case "event_callback":
        this.slackService.receiveMessage(
          params.event.channel,
          params.event.text
        );
        break;
    }

    return ContentService.createTextOutput("success to receive event");
  }
}
