import { EventModel } from "../model";
import { SlackService, EventService } from "../service";
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
  private eventService: EventService;

  constructor() {
    this.slackService = new SlackService();
    this.eventService = new EventService();
  }

  receiveEvent(
    e: GoogleAppsScript.Events.DoPost
  ): GoogleAppsScript.Content.TextOutput {
    const params: postParams = JSON.parse(e.postData.contents) as postParams;
    const result = ContentService.createTextOutput(params.challenge);

    // create event object
    const event = new EventModel(params.event_id);
    event.setType(params.type);
    event.setChannelId(params.event.channel);
    event.setUserId(params.event.user);
    event.setMessage(params.event.text);

    // ignore already received request
    if (this.eventService.exists(event)) {
      LogUtil.logging("this event is already received", "WARN");
      return result;
    }

    // control slack event
    if (event.getType() == "url_verification") {
      // Slack Events API verification
      return result;
    }
    if (event.getType() == "event_callback") {
      // event filtering
      if (this.slackService.eventFilter(event)) {
        LogUtil.logging("this event is not allowed", "WARN");
        return result;
      }

      // action
      this.eventService.store(event);
      this.slackService.receiveMessage(event);
    }

    // logging
    LogUtil.logging(
      `catch slack event {type: ${event.getType()}, event_id: ${event.getId()}}`,
      "INFO"
    );

    return result;
  }
}
