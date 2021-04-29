import { SlackEventModel } from "../model";
import { SlackService, SlackEventService } from "../service";
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
    ts: string;
  };
}

export class SlackEventsController {
  private slackService: SlackService;
  private slackEventService: SlackEventService;

  constructor() {
    this.slackService = new SlackService();
    this.slackEventService = new SlackEventService();
  }

  receiveEvent(
    e: GoogleAppsScript.Events.DoPost
  ): GoogleAppsScript.Content.TextOutput {
    const params: postParams = JSON.parse(e.postData.contents) as postParams;
    const result = ContentService.createTextOutput(params.challenge);

    // create event object
    const slackEvent = new SlackEventModel(params.event_id);
    slackEvent.setType(params.type);
    slackEvent.setChannelId(params.event.channel);
    slackEvent.setUserId(params.event.user);
    slackEvent.setMessage(params.event.text);
    slackEvent.setTimestamp(params.event.ts);

    // ignore already received request
    if (this.slackEventService.exists(slackEvent)) {
      LogUtil.logging("this event is already received", "WARN");
      return result;
    }

    // control slack slackEvent
    if (slackEvent.getType() == "url_verification") {
      // Slack slackEvents API verification
      return result;
    }
    if (slackEvent.getType() == "event_callback") {
      // event filtering
      if (this.slackService.slackEventFilter(slackEvent)) {
        LogUtil.logging("this event is not allowed", "WARN");
        return result;
      }

      // action
      this.slackEventService.store(slackEvent);
      this.slackService.receiveMessage(slackEvent);
    }

    // logging
    LogUtil.logging(
      `catch slack slackEvent {type: ${slackEvent.getType()}, slackEvent_id: ${slackEvent.getId()}}`,
      "INFO"
    );

    return result;
  }
}
