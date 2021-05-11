import { SlackEventModel } from "../../src/model";

// create sample object
const slackEventId = "XXXXXXXXXXX";
const slackEvent = new SlackEventModel();
slackEvent.setId(slackEventId);

test("SlackEventModelのプロパティをテスト", () => {
  expect(slackEvent.getId()).toBe(slackEventId);
});
