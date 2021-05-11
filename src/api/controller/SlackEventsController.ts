import { SlackEventModel } from "../../model";
import { SlackService } from "../../service";
import { LogUtil } from "../../util";

import { SlackMessageEventRequest, SlackSlashCommandRequest } from "../request";
import { SlackSlashCommandResponse } from "../response";

export class SlackEventsController {
  private slackService: SlackService;

  constructor() {
    this.slackService = new SlackService();
  }

  slackMessageEvent(
    e: GoogleAppsScript.Events.DoPost
  ): GoogleAppsScript.Content.TextOutput {
    // POST body
    const params = JSON.parse(e.postData.contents) as SlackMessageEventRequest;
    // json response
    const result = ContentService.createTextOutput(params.challenge);

    // create event object
    const slackEvent = new SlackEventModel();
    slackEvent.setId(params.event_id);
    slackEvent.setType(params.type);

    // control slack slackEvent
    if (slackEvent.getType() == "url_verification") {
      // Slack slackEvents API verification
      return result;
    }
    if (slackEvent.getType() == "event_callback") {
      // set slack event detail
      slackEvent.setChannelId(params.event.channel);
      slackEvent.setUserId(params.event.user);
      slackEvent.setMessage(params.event.text);
      slackEvent.setTimestamp(params.event.ts);

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
      `catch slack event {type: ${slackEvent.getType()}, slackEvent_id: ${slackEvent.getId()}}`,
      "INFO"
    );

    return result;
  }

  slackSlashCommand(
    e: GoogleAppsScript.Events.DoPost,
    command: string
  ): GoogleAppsScript.Content.TextOutput {
    // POST body
    const params = JSON.parse(
      JSON.stringify(e.parameter)
    ) as SlackSlashCommandRequest;
    // json response
    const result: SlackSlashCommandResponse = {
      text: "processing...",
      response_type: "in_channel",
    };

    // create event object
    const slackEvent = new SlackEventModel();
    slackEvent.setMessage(params.text);
    slackEvent.setUserId(params.user_id);
    slackEvent.setChannelId(params.channel_id);
    slackEvent.setCommand(command);

    // event filtering
    if (this.slackService.slackEventFilter(slackEvent)) {
      result.text = "this command cannot be used on this channel";
    } else {
      this.slackService.receiveSlashCommand(slackEvent);
    }

    // logging
    LogUtil.logging(`catch slack slash command: ${command}`, "INFO");

    const response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    response.setContent(JSON.stringify(result));
    return response;
  }
}
