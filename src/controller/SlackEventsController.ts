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
  private lastEventID!: string;

  constructor() {
    this.slackService = new SlackService();
  }

  receiveEvent(
    event: GoogleAppsScript.Events.DoPost
  ): GoogleAppsScript.Content.TextOutput {
    const params: postParams = JSON.parse(
      event.postData.contents
    ) as postParams;

    // ignore received request
    if (params.event_id == this.lastEventID) {
      return ContentService.createTextOutput("this event is already received");
    }
    this.lastEventID = params.event_id;

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
