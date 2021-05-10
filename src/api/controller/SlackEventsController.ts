import { SlackEventModel } from "../../model";
import { SlackService } from "../../service";
import { LogUtil } from "../../util";

import { SlackEventSubmitRequest } from "../request";

export class SlackEventsController {
  private slackService: SlackService;

  constructor() {
    this.slackService = new SlackService();
  }

  slackEventSubmit(
    e: GoogleAppsScript.Events.DoPost
  ): GoogleAppsScript.Content.TextOutput {
    const params = JSON.parse(e.postData.contents) as SlackEventSubmitRequest;
    const result = ContentService.createTextOutput(params.challenge);

    // create event object
    const slackEvent = new SlackEventModel(params.event_id);
    slackEvent.setType(params.type);
    slackEvent.setChannelId(params.event.channel);
    slackEvent.setUserId(params.event.user);
    slackEvent.setMessage(params.event.text);
    slackEvent.setTimestamp(params.event.ts);

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
