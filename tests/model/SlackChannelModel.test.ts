import { SlackChannelModel } from "../../src/model";

// create sample object
const channelId = "XXXXXXXXXXX";
const slackChannel = new SlackChannelModel(channelId);

test("SlackChannelModelのプロパティをテスト", () => {
  expect(slackChannel.getId()).toBe(channelId);
});
