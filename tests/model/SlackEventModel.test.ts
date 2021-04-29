import { SlackEventModel } from "../../src/model";

// create sample object
const slackEventId = "XXXXXXXXXXX";
const slackEventType = "event_callback";
const slackEventUserId = "XXXXXXXXXXX";
const slackEventMessage = "TEST MESSAGE";
const slackEvent = new SlackEventModel(slackEventId);
slackEvent.setType(slackEventType);
slackEvent.setUserId(slackEventUserId);
slackEvent.setMessage(slackEventMessage);

test("SlackEventModelのプロパティをテスト", () => {
  expect(slackEvent.getId()).toBe(slackEventId);
  expect(slackEvent.getType()).toBe(slackEventType);
  expect(slackEvent.getUserId()).toBe(slackEventUserId);
  expect(slackEvent.getMessage()).toBe(slackEventMessage);
});
